import LimitDatabase from "@db/limit-database"
import type { TimeLimit, TimeLimitInfo } from "@entity/dao/time-limit"
import storage from "../__mock__/storage"

const db = new LimitDatabase(storage.local)

describe('archived-database', () => {
    beforeEach(async () => storage.local.clear())
    test('test1', async () => {
        const toAdd: TimeLimit = {
            cond: '123',
            time: 20,
            enabled: true,
            allowDelay: false
        }
        await db.save(toAdd)
        let all: TimeLimit[] = await db.all()
        expect(all.length).toEqual(1)
        expect(all[0]).toEqual({ ...toAdd, latestDate: "", wasteTime: 0 })
        const toRewrite = {
            cond: '123',
            time: 21,
            enabled: true,
            allowDelay: false
        }
        // Not rewrite
        await db.save(toRewrite)
        all = await db.all()
        expect(all[0]).toEqual({ ...toAdd, latestDate: "", wasteTime: 0 })

        await db.remove('123')

        expect((await db.all()).length).toEqual(0)
    })

    test("update waste", async () => {
        await db.save({
            cond: "a.*.com",
            time: 21,
            enabled: true,
            allowDelay: false,
        })
        await db.save({
            cond: "*.b.com",
            time: 20,
            enabled: true,
            allowDelay: false,
        })
        await db.updateWaste("20220606", {
            "a.*.com": 10,
            // Not exist, no error throws
            "foobar": 20,
        })
        const all = await db.all()
        const used = all.find(a => a.cond === "a.*.com")
        expect(used?.latestDate).toEqual("20220606")
        expect(used?.wasteTime).toEqual(10)
    })

    test("import data", async () => {
        const cond1: TimeLimit = {
            cond: "cond1",
            time: 20,
            allowDelay: false,
            enabled: true
        }
        const cond2: TimeLimit = {
            cond: "cond2",
            time: 20,
            allowDelay: false,
            enabled: false
        }
        await db.save(cond1)
        await db.save(cond2)
        const data2Import = await db.storage.get()
        // Set new empty
        data2Import["__timer__LIMIT"]["cond3"] = {}

        // clear
        storage.local.clear()
        expect(await db.all()).toEqual([])

        // cond1 exists
        await db.save({ ...cond1, enabled: false })
        await db.updateWaste("20220606", { "cond1": 10 })

        await db.importData(data2Import)
        const imported = await db.all()
        // Exists
        const cond1After = imported.find(a => a.cond === "cond1")
        expect(cond1After?.latestDate).toEqual("20220606")
        expect(cond1After?.wasteTime).toEqual(10)
        expect(cond1After?.enabled).toBeFalsy()
        // Not exists
        const cond2After = imported.find(a => a.cond === "cond2")
        expect(!!cond2After?.latestDate).toBeFalsy()
        expect(!!cond2After?.wasteTime).toBeFalsy()
        expect(cond2After?.allowDelay).toEqual(cond2.allowDelay)
        expect(cond2After?.enabled).toEqual(cond2.enabled)
        // Not complete
        const cond3After = imported.find(a => a.cond === "cond3")
        expect(cond3After.time).toEqual(0)
        expect(cond3After.enabled).toBeFalsy()
        expect(cond3After.allowDelay).toBeFalsy()
    })

    test("import data2", async () => {
        const importData = {}
        // Invalid data, no error throws
        await db.importData(importData)
        // Valid data
        importData["__timer__LIMIT"] = {}
        await db.importData(importData)
        expect(await db.all()).toEqual([])
    })

    test("update delay", async () => {
        const data: TimeLimit = {
            cond: "cond1",
            time: 20,
            allowDelay: false,
            enabled: true
        }
        await db.save(data)
        await db.updateDelay("cond1", true)
        await db.updateDelay("cond2", true)
        const all: TimeLimitInfo[] = await db.all()
        expect(all.length).toEqual(1)
        const item = all[0]
        expect(item.allowDelay).toBeTruthy()
        expect(item.cond).toEqual("cond1")
    })
})
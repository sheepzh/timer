import MergeRuleDatabase from "@db/merge-rule-database"
import HostMergeRuleItem from "@entity/dto/host-merge-rule-item"
import storage from "../__mock__/storage"

const db = new MergeRuleDatabase(storage.local)

describe('merge-rule-database.test', () => {
    beforeEach(async () => storage.local.clear())

    test('1', async () => {
        let toAdd: HostMergeRuleItem[] = [HostMergeRuleItem.of('4', 2)]
        await db.add(...toAdd)
        expect((await db.selectAll())).toEqual(expect.arrayContaining(toAdd))
        toAdd = [
            HostMergeRuleItem.of('4'),
            HostMergeRuleItem.of('3')
        ]
        await db.add(...toAdd)
        expect((await db.selectAll())).toEqual(expect.arrayContaining([
            // Not rewrite
            HostMergeRuleItem.of('4', 2),
            HostMergeRuleItem.of('3')
        ]))
        await db.remove('4')
        const list = await db.selectAll()
        expect(list.length).toEqual(1)
        expect(list[0]).toEqual(HostMergeRuleItem.of('3', ''))
    })

    test("importData", async () => {
        await db.add(
            HostMergeRuleItem.of("www.baidu.com", 2),
            HostMergeRuleItem.of("www.google.com", "google.com")
        )
        const data2Import = await db.storage.get()
        data2Import.foo = "bar"
        await storage.local.clear()
        expect(await db.selectAll()).toEqual([])

        await db.importData(data2Import)
        const imported: HostMergeRuleItem[] = await db.selectAll()
        expect(imported).toEqual([
            { origin: "www.baidu.com", merged: 2 },
            { origin: "www.google.com", merged: "google.com" }
        ])
    })

    test("importData2", async () => {
        await db.importData(undefined)
        expect(await db.selectAll()).toEqual([])
        await db.importData({ foo: "bar" })
        expect(await db.selectAll()).toEqual([])
    })
})
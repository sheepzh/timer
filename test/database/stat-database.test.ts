import StatDatabase, { StatCondition } from "@db/stat-database"
import { formatTimeYMD, MILL_PER_DAY } from "@util/time"
import { resultOf } from "@util/stat"
import storage from "../__mock__/storage"

const db = new StatDatabase(storage.local)
const now = new Date()
const nowStr = formatTimeYMD(now)
const yesterday = new Date(now.getTime() - MILL_PER_DAY)
const beforeYesterday = new Date(now.getTime() - MILL_PER_DAY * 2)
const baidu = 'www.baidu.com'
const google = 'www.google.com.hk'

describe('stat-database', () => {
    beforeEach(async () => storage.local.clear())

    test('1', async () => {
        await db.accumulate(baidu, now, resultOf(100, 0))
        const data: timer.stat.Result = await db.get(baidu, now)
        expect(data).toEqual(resultOf(100, 0))
    })

    test('2', async () => {
        await db.accumulate(baidu, now, resultOf(200, 0))
        await db.accumulate(baidu, now, resultOf(200, 0))
        let data = await db.get(baidu, now)
        expect(data).toEqual(resultOf(400, 0))
        await db.accumulate(baidu, now, resultOf(0, 1))
        data = await db.get(baidu, now)
        expect(data).toEqual(resultOf(400, 1))
    })

    test('3', async () => {
        await db.accumulateBatch(
            {
                [google]: resultOf(11, 0),
                [baidu]: resultOf(1, 0)
            }, now
        )
        expect((await db.select()).length).toEqual(2)

        await db.accumulateBatch(
            {
                [google]: resultOf(12, 1),
                [baidu]: resultOf(2, 1)
            }, yesterday
        )
        expect((await db.select()).length).toEqual(4)

        await db.accumulateBatch(
            {
                [google]: resultOf(13, 2),
                [baidu]: resultOf(3, 2)
            }, beforeYesterday
        )
        expect((await db.select()).length).toEqual(6)

        let cond: StatCondition = {}
        cond.host = 'google'

        let list = await db.select(cond)
        expect(list.length).toEqual(3)

        // full host is not correct, result is empty
        cond.fullHost = true
        expect((await db.select(cond)).length).toEqual(0)

        cond.host = google
        expect((await db.select(cond)).length).toEqual(3)

        // By date range
        cond = {}
        cond.date = [now, now]
        const expectedResult: timer.stat.Row[] = [
            { date: nowStr, focus: 11, host: google, mergedHosts: [], time: 0, virtual: false },
            { date: nowStr, focus: 1, host: baidu, mergedHosts: [], time: 0, virtual: false }
        ]
        expect(await db.select(cond)).toEqual(expectedResult)
        // Only use start
        cond.date = [now]
        expect(await db.select(cond)).toEqual(expectedResult)
        // Use extra date
        cond.date = now
        expect(await db.select(cond)).toEqual(expectedResult)

        // If start is after end, nothing returned
        cond.date = [now, yesterday]
        expect(await db.select(cond)).toEqual([])

        // test item
        cond = {}

        // focus [0,10]
        cond.focusRange = [0, 10]
        expect((await db.select(cond)).length).toEqual(3)

        // time [2, 3]
        cond.timeRange = [2, 3]
        cond.focusRange = [, null]
        expect((await db.select(cond)).length).toEqual(2)
    })

    test('5', async () => {
        await db.accumulate(baidu, now, resultOf(10, 0))
        await db.accumulate(baidu, yesterday, resultOf(12, 0))
        expect((await db.select()).length).toEqual(2)
        // Delete yesterday's data
        await db.deleteByUrlAndDate(baidu, yesterday)
        expect((await db.select()).length).toEqual(1)
        // Delete yesterday's data again, nothing changed
        await db.deleteByUrlAndDate(baidu, yesterday)
        expect((await db.get(baidu, now)).focus).toEqual(10)
        // Add one again, and another
        await db.accumulate(baidu, beforeYesterday, resultOf(1, 1))
        await db.accumulate(google, now, resultOf(0, 0))
        expect((await db.select()).length).toEqual(3)
        // Delete all the baidu
        await db.deleteByUrl(baidu)
        const cond: StatCondition = { host: baidu, fullHost: true }
        // Nothing of baidu remained
        expect((await db.select(cond)).length).toEqual(0)
        // But google remained
        cond.host = google
        const list = await db.select(cond)
        expect(list.length).toEqual(1)
        // Add one item of baidu again again
        await db.accumulate(baidu, now, resultOf(1, 1))
        // But delete google
        await db.delete(list)
        // Then only one item of baidu
        expect((await db.select()).length).toEqual(1)
    })

    test('6', async () => {
        await db.accumulateBatch({}, now)
        expect((await db.select()).length).toEqual(0)
        // Return zero instance
        const result = await db.get(baidu, now)
        expect([result.focus, result.time]).toEqual([0, 0])
    })

    test('7', async () => {
        const foo = resultOf(1, 1)
        await db.accumulate(baidu, now, foo)
        await db.accumulate(baidu, yesterday, foo)
        await db.accumulate(baidu, beforeYesterday, foo)
        await db.deleteByUrlBetween(baidu, now, now)
        expect((await db.select()).length).toEqual(2)

        await db.deleteByUrlBetween(baidu, now, beforeYesterday) // Invalid
        expect((await db.select()).length).toEqual(2)
    })

    test("importData", async () => {
        const foo = resultOf(1, 1)
        await db.accumulate(baidu, now, foo)
        const data2Import = await db.storage.get()
        storage.local.clear()

        data2Import.foo = "bar"
        await db.importData(data2Import)
        const data = await db.select({})
        expect(data.length).toEqual(1)
        const item = data[0]
        expect(item.date).toEqual(formatTimeYMD(now))
        expect(item.host).toEqual(baidu)
        expect(item.focus).toEqual(1)
        expect(item.time).toEqual(1)
    })

    test("importData2", async () => {
        await db.importData({
            // Valid
            "20210910github.com": {
                focus: 1,
                time: 1
            },
            // Valid
            "20210911github.com": {
                focus: 1
            },
            // Invalid
            "20210912github.com": "foobar",
            // Invalid
            "20210913github.com": undefined,
            // Ignored with zero info
            "20210914github.com": {}
        })
        const imported = await db.select()
        expect(imported.length).toEqual(2)
    })

    test("importData3", async () => {
        await db.importData([])
        expect(await db.select()).toEqual([])
        await db.importData({ foo: "bar" })
        expect(await db.select()).toEqual([])
        await db.importData(false)
        expect(await db.select()).toEqual([])
    })

    test("count", async () => {
        await db.accumulate(baidu, now, resultOf(1, 1))
        await db.accumulate(baidu, yesterday, resultOf(2, 1))
        await db.accumulate(google, now, resultOf(3, 1))
        await db.accumulate(google, yesterday, resultOf(4, 1))
        // Count by host
        expect(await db.count({
            host: baidu,
            fullHost: true
        })).toEqual(2)
        // Count all
        expect(await db.count(undefined)).toEqual(4)
        // Count by fuzzy
        expect(await db.count({ host: "www", fullHost: false })).toEqual(4)
        // Count by date
        expect(await db.count({ host: google, fullHost: true, date: now })).toEqual(1)
    })
})
import { DATE_FORMAT } from "@db/common/constant"
import PeriodDatabase from "@db/period-database"
import FocusPerDay from "@entity/dao/period-info"
import PeriodInfo, { MILLS_PER_PERIOD, PeriodKey } from "@entity/dto/period-info"
import { formatTime } from "@util/time"
import storage from "../__mock__/storage"

const db = new PeriodDatabase(storage.local)

describe('timer-database', () => {
    beforeEach(async () => storage.local.clear())

    test('1', async () => {
        const date = new Date(2021, 5, 7)
        const dateStr = formatTime(date, DATE_FORMAT)
        const yesterday = new Date(2021, 5, 6)

        expect((await db.get(dateStr))).toEqual({})

        const toAdd: PeriodInfo[] = [
            PeriodKey.of(date, 0).produce(56999),
            PeriodKey.of(date, 1).produce(2),
            PeriodKey.of(yesterday, 95).produce(2)
        ]
        await db.accumulate(toAdd)
        await db.accumulate([
            PeriodKey.of(date, 1).produce(20)
        ])
        const data: FocusPerDay = await db.get(dateStr)
        expect(data).toEqual({ 0: 56999, 1: 22 })
        const yesterdayStr = formatTime(yesterday, DATE_FORMAT)
        const yesterdayData: FocusPerDay = await db.get(yesterdayStr)
        expect(yesterdayData).toEqual({ 95: 2 })
    })

    test('getBatch', async () => {
        const date = new Date(2021, 5, 7)
        const yesterday = new Date(2021, 5, 6)
        const toAdd: PeriodInfo[] = [
            PeriodKey.of(date, 0).produce(56999),
            PeriodKey.of(date, 1).produce(2),
            PeriodKey.of(yesterday, 95).produce(2)
        ]
        await db.accumulate(toAdd)

        let list = await db.getBatch(['20210607', '20210606'])
        expect(list.length).toEqual(3)
        let all = await db.getAll()
        expect(all).toEqual(toAdd)
    })

    test("importData", async () => {
        const date = new Date(2021, 5, 7)
        const yesterday = new Date(2021, 5, 6)
        const toAdd: PeriodInfo[] = [
            PeriodKey.of(date, 0).produce(56999),
            PeriodKey.of(date, 1).produce(2),
            PeriodKey.of(yesterday, 95).produce(2)
        ]
        await db.accumulate(toAdd)

        const data2Import = await db.storage.get()
        storage.local.clear()
        expect(await db.getAll()).toEqual([])
        data2Import.foo = "bar"
        db.importData(data2Import)

        const imported = await db.getAll()
        expect(imported.length).toEqual(3)
    })

    // Invalid data
    test("importData2", async () => {
        await db.importData(undefined)
        expect(await db.getAll()).toEqual([])
        await db.importData({ foo: "bar" })
        expect(await db.getAll()).toEqual([])
        await db.importData([])
        expect(await db.getAll()).toEqual([])
        await db.importData(1)
        expect(await db.getAll()).toEqual([])
        await db.importData({
            __timer__PERIOD20210607: {
                "-1": 100,
                foo: "bar",
                96: 1000,
                85: "???",
                3: undefined,
                4: "",
            }
        })
        expect(await db.getAll()).toEqual([])
    })

    test("importData3", async () => {
        await db.importData({
            __timer__PERIOD20210607: {
                0: MILLS_PER_PERIOD + 1,
                1: 100,
                2: "100",
            }
        })
        const imported: PeriodInfo[] = await db.getAll()
        expect(imported.length).toEqual(3)
        const orderMillMap = {}
        imported.forEach(({ milliseconds, order }) => orderMillMap[order] = milliseconds)
        expect(orderMillMap).toEqual({ 0: MILLS_PER_PERIOD, 1: 100, 2: 100 })
    })
})

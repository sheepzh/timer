import { DATE_FORMAT } from "@db/common/constant"
import PeriodDatabase from "@db/period-database"
import FocusPerDay from "@entity/dao/period-info"
import PeriodInfo, { PeriodKey } from "@entity/dto/period-info"
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
    })
})

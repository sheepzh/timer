import PeriodDatabase from "../../src/database/period-database"
import FocusPerDay from "../../src/entity/dao/period-info"
import PeriodInfo from "../../src/entity/dto/period-info"
import storage from "../__mock__/storage"

const db = new PeriodDatabase(storage.local)


describe('timer-database', () => {
    beforeEach(async () => storage.local.clear())

    test('1', async () => {
        const date = '20210607'
        const yesterday = '20210606'

        expect((await db.get(date))).toEqual({})

        const toAdd: PeriodInfo[] = [
            { date, minuteOrder: 0, millseconds: 56999 },
            { date, minuteOrder: 1, millseconds: 2 },
            { date: yesterday, minuteOrder: 1439, millseconds: 2 }
        ]
        await db.accumulate(toAdd)
        await db.accumulate([
            { date, minuteOrder: 1, millseconds: 20 }
        ])
        const data: FocusPerDay = await db.get(date)
        expect(data).toEqual({ 0: 56999, 1: 22 })
        const yesterdayData: FocusPerDay = await db.get(yesterday)
        expect(yesterdayData).toEqual({ 1439: 2 })
    })
})
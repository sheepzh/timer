import LimitDatabase from '../../src/database/limit-database'
import { TimeLimit } from '../../src/entity/dao/time-limit'
import storage from '../__mock__/storage'

const db = new LimitDatabase(storage.local)

describe('archived-database', () => {
    beforeEach(async () => storage.local.clear())
    test('test1', async () => {
        const toAdd: TimeLimit = {
            cond: '123',
            time: 20,
            enabled: true
        }
        await db.save(toAdd)
        let all: TimeLimit[] = await db.all()
        expect(all.length).toEqual(1)
        expect(all[0]).toEqual(toAdd)
        const toRewrite = {
            cond: '123',
            time: 21,
            enabled: true
        }
        // Not rewrited
        await db.save(toRewrite)
        all = await db.all()
        expect(all[0]).toEqual(toAdd)

        await db.remove('123')

        expect((await db.all()).length).toEqual(0)
    })
})
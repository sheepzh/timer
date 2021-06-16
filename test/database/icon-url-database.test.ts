import IconUrlDatabase from '../../src/database/icon-url-database'
import storage from '../__mock__/storage'

const db = new IconUrlDatabase(storage.local)

const baidu = 'baidu.com'

describe('icon-url-database', () => {
    beforeEach(async () => storage.local.clear())

    test('1', async () => {
        await db.put(baidu, 'test1')
        expect((await db.get(baidu))[baidu]).toEqual('test1')
        await db.put(baidu, 'test2')
        expect((await db.get(baidu))[baidu]).toEqual('test2')
        let foo = 'baidu123213131'
        expect((await db.get(foo))[foo]).toBeUndefined()
    })
})
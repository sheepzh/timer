import WhitelistDatabase from "@db/whitelist-database"
import storage from "../__mock__/storage"

const db = new WhitelistDatabase(storage.local)

describe('timer-database', () => {
    beforeEach(async () => storage.local.clear())

    test('1', async () => {
        await db.add('www.baidu.com')
        await db.add('google.com')
        const list = await db.selectAll()
        expect(list.sort()).toEqual(['www.baidu.com', 'google.com'].sort())
        expect((await db.includes('www.baidu.com'))).toBeTruthy()
        await db.remove('www.baidu.com')
        await db.remove('www.baidu.com111')
        expect((await db.selectAll())).toEqual(['google.com'])
        expect((await db.includes('www.baidu.com'))).toBeFalsy()
        await db.add('google.com')
        expect((await db.selectAll())).toEqual(['google.com'])
    })
})
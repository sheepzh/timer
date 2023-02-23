import IconUrlDatabase from "@db/icon-url-database"
import storage from "../__mock__/storage"

const db = new IconUrlDatabase(storage.local)

const baidu = 'baidu.com'

describe('icon-url-database', () => {
    beforeEach(async () => {
        await storage.local.clear()
        // Mock Chrome
        const mockUserAgent = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36"
        Object.defineProperty(global.navigator, 'userAgent', { value: mockUserAgent, configurable: true })
    })

    test('1', async () => {
        await db.put(baidu, 'test1')
        expect((await db.get(baidu))[baidu]).toEqual('test1')
        await db.put(baidu, 'test2')
        expect((await db.get(baidu))[baidu]).toEqual('test2')
        let foo = 'baidu123213131'
        expect((await db.get(foo))[foo]).toBeUndefined()
    })

    // Invalid url starting with chrome:// or edge://
    test('2', async () => {
        await db.put(baidu, 'chrome://favicon/https://baidu.com')
        expect(await db.get(baidu)[baidu]).toBeUndefined()
        await db.put(baidu, 'edge://favicon/https://baidu.com')
        expect(await db.get(baidu)[baidu]).toBeUndefined()
    })

    test("import data", async () => {
        await db.put(baidu, "test1")
        const data2Import = {
            "__timer__ICON_URLbaidu.com": "test0",
            "__timer__ICON_URLwww.qq.com": "test2",
            // Invalid icon url
            "_timer__ICON_URLwww.qq.com": "1111",
            // Not import
            "__timer__ICON_URLgoogle.com": "chrome://favicon/google.com"
        }
        await db.importData(data2Import)
        const items = await db.storage.get()
        expect(Object.values(items).length).toEqual(2)
        // Not overwrite
        const baiduIconUrl = (await db.get(baidu))[baidu]
        expect(baiduIconUrl).toEqual('test1')
        const qqIconUrl = (await db.get("www.qq.com"))["www.qq.com"]
        expect(qqIconUrl).toEqual('test2')
        // Not import
        const googleIconUrl = (await db.get("google.com"))["google.com"]
        expect(googleIconUrl).toBeUndefined()
    })
})
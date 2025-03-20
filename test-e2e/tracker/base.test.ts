import { launchBrowser, type LaunchContext, sleep } from "../common/base"
import { readRecordsOfFirstPage } from "../common/record"
import { createWhitelist } from "../common/whitelist"

let context: LaunchContext

describe('Tracking', () => {
    beforeEach(async () => context = await launchBrowser())

    afterEach(() => context.close())

    test('basic tracking', async () => {
        const page = await context.newPageAndWaitCsInjected('https://www.google.com')
        await sleep(2)
        let records = await readRecordsOfFirstPage(context)

        expect(records.length).toEqual(1)
        const { visit: visitStr, time: timeStr } = records[0]
        // 1 visit
        expect(visitStr).toEqual("1")
        // >= 2 s
        const time = parseInt(timeStr.replace('s', '').trim())
        expect(time >= 2)

        // Another page
        await page.bringToFront()
        await page.goto('https://www.baidu.com')

        records = await readRecordsOfFirstPage(context)
        expect(records.length).toEqual(2)
        const urls = records.map(r => r.url)
        expect(urls.includes('baidu.com') || urls.includes('www.baidu.com'))
    }, 60000)

    test('white list', async () => {
        const page = await context.newPageAndWaitCsInjected('https://www.google.com')
        await sleep(2)
        let records = await readRecordsOfFirstPage(context)

        expect(records.length).toEqual(1)
        const { visit: visitStr, time: timeStr } = records[0]
        // 1 visit
        expect(visitStr).toEqual("1")
        // >= 2 s
        const time = parseInt(timeStr.replace('s', '').trim())
        expect(time >= 2)

        await createWhitelist(context, 'www.google.com')
        await page.bringToFront()
        await page.reload()
        await sleep(2)
        records = await readRecordsOfFirstPage(context)
        expect(records.length).toEqual(1)
        expect(records[0].time).toEqual(timeStr)
        expect(records[0].visit).toEqual("1")
    }, 60000)
})
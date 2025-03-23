import { launchBrowser, sleep, type LaunchContext } from "../common/base"
import { parseTime2Sec, readRecordsOfFirstPage } from "../common/record"
import { createWhitelist } from "../common/whitelist"

let context: LaunchContext

async function clickRunTimeChange(siteHost: string): Promise<void> {
    const sitePage = await context.openAppPage("/additional/site-manage")
    await sitePage.focus('.filter-container input')
    await sitePage.keyboard.type(siteHost)
    await sitePage.keyboard.press('Enter')
    await sleep(.1)
    await sitePage.evaluate(() => {
        const runTimeSwitch = document.querySelector<HTMLDivElement>('#site-manage-table-wrapper table > tbody > tr > td.el-table_1_column_7 .el-switch')
        runTimeSwitch?.click()
    })
    await sleep(.2)
    await sitePage.close()
}

describe('Run time tracking', () => {
    beforeEach(async () => context = await launchBrowser())

    afterEach(() => context.close())

    test('Basically track', async () => {
        const page = await context.newPage()
        await page.goto('https://www.baidu.com', { waitUntil: 'load' })
        await sleep(1)
        let records = await readRecordsOfFirstPage(context)
        let record = records[0]
        expect(parseTime2Sec(record.time)).toBeGreaterThanOrEqual(1)
        expect(record.runTime).toBeFalsy()

        // 1. Enable run time tracking
        const enableTs = Date.now()
        await clickRunTimeChange('www.baidu.com')

        // 2. Sleep
        const emptyPage = await context.newPage()
        await sleep(2)

        records = await readRecordsOfFirstPage(context)
        const runTime1 = parseTime2Sec(records[0]?.runTime) ?? 0
        expect(runTime1).toBeGreaterThanOrEqual(2)

        // 3. Add another page sharing the same run time with old page
        await context.newPageAndWaitCsInjected('https://www.baidu.com')
        // jump to new page
        await emptyPage.bringToFront()
        await sleep(2)

        records = await readRecordsOfFirstPage(context)
        const runTime2 = parseTime2Sec(records[0].runTime)
        expect(runTime2).toBeGreaterThanOrEqual(runTime1 + 2)
        expect(runTime2).toBeLessThan((Date.now() - enableTs) / 1000)

        // 3. Disable run time tracking
        await clickRunTimeChange('www.baidu.com')
        const disableTs = Date.now()
        await emptyPage.bringToFront()
        await sleep(4)
        records = await readRecordsOfFirstPage(context)
        const runTime3 = parseTime2Sec(records[0].runTime)
        expect(runTime3).toBeLessThanOrEqual((disableTs - enableTs) / 1000)
    }, 60000)

    test('white list', async () => {
        await context.newPage('https://www.baidu.com')

        // 1. Enable
        await clickRunTimeChange('www.baidu.com')
        const enableTs = Date.now()
        await sleep(4)

        let records = await readRecordsOfFirstPage(context)
        const runTime = parseTime2Sec(records[0].runTime)
        expect(runTime).toBeTruthy()
        expect(runTime).toBeLessThanOrEqual((Date.now() - enableTs + 500) / 1000)

        // 2. Add whitelist
        await createWhitelist(context, 'www.baidu.com')
        const disableTs = Date.now()

        await sleep(2)

        records = await readRecordsOfFirstPage(context)
        const runTime1 = parseTime2Sec(records[0].runTime)
        expect(runTime1).toBeLessThan((disableTs - enableTs) / 1000)
    }, 60000)
})

import { type Browser } from "puppeteer"
import { launchBrowser, sleep } from "../common"

let browser: Browser, extensionId: string

function readRecords() {
    const rows = document.querySelectorAll('.el-table .el-table__body-wrapper table tbody tr')
    return Array.from(rows)
        .map(row => {
            const cells = row.querySelectorAll('td')
            const date = cells[1].textContent
            const url = cells[2].textContent
            const name = cells[3].textContent
            const category = cells[4].textContent
            const time = cells[5].textContent
            const visit = cells[6].textContent
            return { date, url, name, category, time, visit }
        })
}

describe('Tracking', () => {
    beforeEach(async () => {
        const launchRes = await launchBrowser()
        browser = launchRes.browser
        extensionId = launchRes.extensionId
    })

    afterEach(async () => {
        await browser.close()
        browser = undefined
        extensionId = undefined
    })

    test('basic tracking', async () => {
        const page = await browser.newPage()
        await page.goto('https://www.google.com', { waitUntil: 'domcontentloaded' })
        await sleep(2)
        const recordPage = await browser.newPage()
        await recordPage.goto(`chrome-extension://${extensionId}/static/app.html#/data/report`)
        // At least one record
        await recordPage.waitForSelector('.el-table .el-table__body-wrapper table tbody tr td')

        let records = await recordPage.evaluate(readRecords)

        expect(records.length).toEqual(1)
        const { visit: visitStr, time: timeStr } = records[0]
        // 1 visit
        expect(visitStr).toEqual("1")
        // >= 5 s
        const time = parseInt(timeStr.replace('s', '').trim())
        expect(time >= 2)

        // Another page
        await page.bringToFront()
        await page.goto('https://www.github.com')

        // Check result
        await recordPage.bringToFront()
        await recordPage.reload()
        await recordPage.waitForSelector('.el-table .el-table__body-wrapper table tbody tr td')

        records = await recordPage.evaluate(readRecords)
        expect(records.length).toEqual(2)
        const urls = records.map(r => r.url)
        expect(urls.includes('github.com') || urls.includes('www.github.com'))
    }, 60000)
})
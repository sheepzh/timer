import { type Browser } from "puppeteer"
import { launchBrowser, openAppPage, sleep } from "../common"
import { createLimitRule } from "./common"

let browser: Browser, extensionId: string

describe('Daily time limit', () => {
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

    test("Daily visit limit", async () => {
        const limitPage = await openAppPage(browser, extensionId, '/behavior/limit')
        const demoRule: timer.limit.Rule = { name: 'TEST DAILY LIMIT', cond: ['https://github.com'], time: 0, count: 1 }

        // 1. Insert limit rule
        await createLimitRule(demoRule, limitPage)

        // 2. Open test page
        const testPage = await browser.newPage()
        await testPage.goto('https://github.com/sheepzh/timer', { waitUntil: 'domcontentloaded' })

        // Assert not limited
        await limitPage.bringToFront()
        // Wait refreshing the table
        await sleep(.1)
        const infoTag = await limitPage.$$('.el-table .el-table__body-wrapper table tbody tr td:nth-child(5) .el-tag.el-tag--info')
        expect(infoTag.length).toEqual(2)

        // 3. Reload page
        await testPage.bringToFront()
        await testPage.reload({ waitUntil: 'domcontentloaded' })

        // Waiting for limit message handling
        await sleep(.5)
        const { name, count } = await testPage.evaluate(async () => {
            const shadow = document.querySelector('extension-time-tracker-overlay')
            const descEl = shadow.shadowRoot.querySelector('#app .el-descriptions:not([style*="display: none"])')
            const trs = descEl.querySelectorAll('tr')
            const name = trs[0].querySelector('td:nth-child(2)').textContent
            const count = trs[2].querySelector('td:nth-child(2) .el-tag--danger').textContent
            return { name, count }
        })

        expect(name).toBe(demoRule.name)
        expect(count.split?.(' ')[0]).toBe('2')
    }, 60000)
})
import { type Browser } from "puppeteer"
import { launchBrowser, openAppPage, sleep } from "../common/base"
import { createLimitRule, fillTimeLimit } from "./common"

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

    test('basic', async () => {
        const limitPage = await openAppPage(browser, extensionId, '/behavior/limit')
        const demoRule: timer.limit.Rule = { name: 'TEST DAILY LIMIT', cond: ['https://github.com'], time: 5 }

        // 1. Insert limit rule
        await createLimitRule(demoRule, limitPage)

        // 2. Open test page
        const testPage = await browser.newPage()
        // Not wait goto finished
        testPage.goto('https://github.com/sheepzh/timer')
        await testPage.waitForSelector('body')
        await sleep(4)

        // Assert not limited
        await limitPage.bringToFront()
        // Wait refreshing the table
        await sleep(.1)
        let wastedTime = await limitPage.evaluate(() => {
            const timeTag = document.querySelector('.el-table .el-table__body-wrapper table tbody tr td:nth-child(6) .el-tag:first-child')
            const timeStr = timeTag.textContent
            return parseInt(timeStr.replace('s', '').trim())
        })
        expect(wastedTime >= 4 && wastedTime <= 5).toBe(true)

        // 3. Switch to test page again
        await testPage.bringToFront()
        await sleep(2)

        // 4. Limited
        const { name, time } = await testPage.evaluate(async () => {
            const shadow = document.querySelector('extension-time-tracker-overlay')
            const descEl = shadow.shadowRoot.querySelector('#app .el-descriptions:not([style*="display: none"])')
            const trs = descEl.querySelectorAll('tr')
            const name = trs[0].querySelector('td:nth-child(2)').textContent
            const time = trs[2].querySelector('td:nth-child(2) .el-tag--danger').textContent
            return { name, time }
        })
        expect(name).toEqual(demoRule.name)
        expect(time.replace('s', '').trim()).toEqual('5')

        // 5. Check limit page
        await limitPage.bringToFront()
        await sleep(.1)
        wastedTime = await limitPage.evaluate(() => {
            const timeTag = document.querySelector('.el-table .el-table__body-wrapper table tbody tr td:nth-child(6) .el-tag--danger')
            const timeStr = timeTag.textContent
            return parseInt(timeStr.replace('s', '').trim())
        })
        expect(wastedTime).toEqual(5)

        // 6. Change daily limit time
        await limitPage.click('.el-card__body .el-table tr td .el-button--primary')

        await sleep(.1)
        await limitPage.click('.el-dialog .el-button.el-button--primary')

        await sleep(.1)
        await limitPage.click('.el-dialog .el-button.el-button--primary')

        await sleep(.1)
        const timeInput = await limitPage.$('.el-dialog .el-date-editor:first-child input')
        await fillTimeLimit(10, timeInput, limitPage)
        await limitPage.click('.el-dialog .el-button.el-button--success')

        // 7. Modal disappear
        await testPage.bringToFront()
        await sleep(.5)
        const modalExist = await testPage.evaluate(() => {
            const shadow = document.querySelector('extension-time-tracker-overlay')
            if (!shadow) return false
            return !!shadow.shadowRoot.querySelector('body:not([style*="display: none"])')
        })
        expect(modalExist).toBeFalsy()
    }, 60000)
})
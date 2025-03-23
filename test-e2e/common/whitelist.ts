import { type Browser } from "puppeteer"
import { LaunchContext, sleep } from "./base"

export async function createWhitelist(context: LaunchContext, white: string) {
    const whitePage = await context.openAppPage('/additional/whitelist')

    const btn = await whitePage.waitForSelector('.item-add-button')
    await btn?.click()
    await sleep(.2)

    const input = await whitePage.$('.item-input-container:not([style*="display: none"]) input')
    await input?.focus()
    await whitePage.keyboard.type(white)
    await sleep(.4)
    const selectItem = await whitePage.waitForSelector('.el-popper .el-select-dropdown li:nth-child(2)')
    await selectItem?.click()
    await whitePage.click('.item-input-container:not([style*="display: none"]) .item-check-button.editable-item')
    const checkBtn = await whitePage.waitForSelector('.el-overlay.is-message-box .el-button.el-button--primary')
    await checkBtn?.click()
    await sleep(.2)

    await whitePage.close()
}
import { join } from "path"
import { launchBrowser, type LaunchResult } from "./common/base"

let launchRes: LaunchResult

describe('After installed', () => {
    beforeEach(async () => {
        const path = join(__dirname, '..', 'dist_prod')
        launchRes = await launchBrowser(path)
    })

    test('Open the official page', async () => {
        const { browser } = launchRes
        await browser.waitForTarget(target => target.url().includes('wfhg.cc'))
        await launchRes?.browser.close()
    }, 5000)
})


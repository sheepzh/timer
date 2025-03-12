import { type Browser, launch, type Page } from "puppeteer"
import { E2E_OUTPUT_PATH } from "../../webpack/constant"

const USE_HEADLESS_PUPPETEER = !!process.env['USE_HEADLESS_PUPPETEER']

export type LaunchResult = {
    browser: Browser
    extensionId: string
}

export async function launchBrowser(dirPath?: string): Promise<LaunchResult> {
    dirPath = dirPath ?? E2E_OUTPUT_PATH

    const browser = await launch({
        defaultViewport: null,
        headless: USE_HEADLESS_PUPPETEER,
        args: [
            `--disable-extensions-except=${dirPath}`,
            `--load-extension=${dirPath}`,
            '--start-maximized',
            '--no-sandbox',
        ],
    })
    const serviceWorker = await browser.waitForTarget(target => target.type() === 'service_worker')
    const url = serviceWorker.url()
    let extensionId = url?.split?.('/')?.[2]
    if (!extensionId) {
        throw new Error('Failed to detect extension id')
    }

    return { browser, extensionId }
}

export function sleep(seconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000))
}

export async function openAppPage(browser: Browser, extId: string, route: string): Promise<Page> {
    const page = await browser.newPage()
    await page.goto(`chrome-extension://${extId}/static/app.html#${route}`)
    return page
}

export async function newPage(browser: Browser, url: string): Promise<Page> {
    const page = await browser.newPage()
    await page.goto(url, { waitUntil: 'load' })
    return page
}

export async function newPageAndWaitCsInjected(browser: Browser, extensionId: string, url: string) {
    const page = await browser.newPage()
    await page.goto(url)
    await page.waitForSelector(`#__TIMER_INJECTION_FLAG__${extensionId}`)
    return page
}
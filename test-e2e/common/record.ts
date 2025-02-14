import type { Browser } from "puppeteer"

type RecordRow = {
    date: string
    url: string
    name: string
    category: string
    time: string
    visit: string
}

function readRecords(): RecordRow[] {
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

export async function readRecordsOfFirstPage(browser: Browser, extensionId: string) {
    const recordPage = await browser.newPage()
    await recordPage.goto(`chrome-extension://${extensionId}/static/app.html#/data/report`)
    // At least one record
    await recordPage.waitForSelector('.el-table .el-table__body-wrapper table tbody tr td')
    let records = await recordPage.evaluate(readRecords)
    await recordPage.close()
    return records
}
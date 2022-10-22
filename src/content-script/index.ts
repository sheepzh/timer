/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { initLocale } from "@util/i18n"
import processLimit from "./limit"
import printInfo from "./printer"

const host = document.location.host
const url = document.location.href

function isInWhitelist(host: string): Promise<boolean> {
    const request: timer.mq.Request<string> = {
        code: 'cs.isInWhitelist',
        data: host
    }
    return new Promise(resolve => chrome.runtime.sendMessage(request, {},
        (res: timer.mq.Response<boolean>) => resolve(res.code === 'success' && !!res.data)
    ))
}

function addOneTime(host: string): void {
    const request: timer.mq.Request<string> = {
        code: 'cs.incVisitCount',
        data: host
    }
    chrome.runtime.sendMessage(request, () => { })
}

function printTodayInfo(): Promise<boolean> {
    const request: timer.mq.Request<void> = {
        code: 'cs.printTodayInfo',
        data: undefined
    }
    return new Promise(resolve => chrome.runtime.sendMessage(request,
        (res: timer.mq.Response<boolean>) => resolve(res.code === 'success' && !!res.data)
    ))
}

async function main() {
    if (!host) return

    const isWhitelist = await isInWhitelist(host)
    if (isWhitelist) return

    addOneTime(host)

    await initLocale()
    const needPrintInfo = await printTodayInfo()
    !!needPrintInfo && printInfo(host)
    processLimit(url)
}

main()
/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { sendMsg2Runtime } from "@api/chrome/runtime"
import { initLocale } from "@i18n"
import TrackerClient from "@src/background/timer/client"
import processLimit from "./limit"
import printInfo from "./printer"

const host = document?.location?.host
const url = document?.location?.href

const FLAG_ID = '__TIMER_INJECTION_FLAG__' + chrome.runtime.id

function getOrSetFlag(): boolean {
    const pre = document?.getElementById(FLAG_ID)
    if (!pre) {
        const flag = document?.createElement('a')
        flag.style && (flag.style.visibility = 'hidden')
        flag && (flag.id = FLAG_ID)
        document?.body?.appendChild(flag)
    }
    return !!pre
}

async function main() {
    // Execute in every injections
    new TrackerClient().init()

    // Execute only one time
    if (getOrSetFlag()) return
    if (!host) return

    const isWhitelist = await sendMsg2Runtime('cs.isInWhitelist', host)
    if (isWhitelist) return

    sendMsg2Runtime('cs.incVisitCount', { host, url })

    await initLocale()
    const needPrintInfo = await sendMsg2Runtime('cs.printTodayInfo')
    !!needPrintInfo && printInfo(host)
    processLimit(url)
}

main()
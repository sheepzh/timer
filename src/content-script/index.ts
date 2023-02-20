/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { sendMsg2Runtime } from "@api/chrome/runtime"
import { initLocale } from "@i18n"
import processLimit from "./limit"
import printInfo from "./printer"

const host = document?.location?.host
const url = document?.location?.href

async function main() {
    if (!host) return

    const isWhitelist = await sendMsg2Runtime('cs.isInWhitelist', host)
    if (isWhitelist) return

    sendMsg2Runtime('cs.incVisitCount', host)

    await initLocale()
    const needPrintInfo = await sendMsg2Runtime('cs.printTodayInfo')
    !!needPrintInfo && printInfo(host)
    processLimit(url)
}

main()
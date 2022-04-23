/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import optionService from "@service/option-service"
import timerService from "@service/timer-service"
import whitelistService from "@service/whitelist-service"
import { initLocale } from "@util/i18n"
import processLimit from "./limit"
import printInfo from "./printer"

const host = document.location.host
const url = document.location.href

async function main() {
    if (!host) return

    const isWhitelist = await whitelistService.include(host)
    if (isWhitelist) return

    timerService.addOneTime(host)

    await initLocale()
    const option = await optionService.getAllOption()
    if (!!option.printInConsole) {
        printInfo(host)
    }
    processLimit(url)
}

main()
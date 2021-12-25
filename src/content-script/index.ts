/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import timerService from "@service/timer-service"
import whitelistService from "@service/whitelist-service"
import processLimit from "./limit"
import printInfo from "./printer"

const host = document.location.host
const url = document.location.href

async function main() {
    if (!host) return

    const isWhitelist = await whitelistService.include(host)
    if (isWhitelist) return

    timerService.addOneTime(host)
    printInfo(host)
    processLimit(url)
}

main()
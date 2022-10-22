/**
 * Copyright (c) 2022-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import TimeLimitItem from "@entity/time-limit-item"
import limitService from "@service/limit-service"
import optionService from "@service/option-service"
import timerService from "@service/timer-service"
import whitelistService from "@service/whitelist-service"
import MessageDispatcher from "./message-dispatcher"

/**
 * Handle request from contentscript
 * 
 * @param dispatcher message dispatcher
 */
export default function init(dispatcher: MessageDispatcher) {
    dispatcher
        // Increase the visit time
        .register<string, void>('cs.incVisitCount', async host => {
            timerService.addOneTime(host)
        })
        // Judge is in whitelist
        .register<string, boolean>('cs.isInWhitelist', host => whitelistService.include(host))
        // Need to print the information of today
        .register<void, boolean>('cs.printTodayInfo', async () => {
            const option = await optionService.getAllOption()
            return !!option.printInConsole
        })
        // Get today info
        .register<string, timer.stat.Result>('cs.getTodayInfo', host => {
            const now = new Date()
            return timerService.getResult(host, now)
        })
        // More minutes
        .register<string, timer.limit.Item[]>('cs.moreMinutes', url => limitService.moreMinutes(url))
        // cs.getLimitedRules
        .register<string, TimeLimitItem[]>('cs.getLimitedRules', url => limitService.getLimited(url))
}
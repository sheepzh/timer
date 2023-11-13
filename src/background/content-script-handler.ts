/**
 * Copyright (c) 2022-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import limitService from "@service/limit-service"
import optionService from "@service/option-service"
import statService from "@service/stat-service"
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
        .register<string | { host: string, url: string }, void>('cs.incVisitCount', async (param) => {
            let host: string, url: string = undefined
            if (typeof param === 'string') {
                host = param
            } else {
                host = param?.host
                url = param?.url
            }
            statService.addOneTime(host, url)
        })
        // Judge is in whitelist
        .register<string, boolean>('cs.isInWhitelist', host => whitelistService.include(host))
        // Need to print the information of today
        .register<void, boolean>('cs.printTodayInfo', async () => {
            const option = await optionService.getAllOption()
            return !!option.printInConsole
        })
        // Get today info
        .register<string, timer.stat.Result>('cs.getTodayInfo', host => statService.getResult(host, new Date()))
        // cs.getLimitedRules
        .register<string, timer.limit.Item[]>('cs.getLimitedRules', url => limitService.getLimited(url))
        .register<string, timer.limit.Item[]>('cs.getRelatedRules', url => limitService.getRelated(url))
}
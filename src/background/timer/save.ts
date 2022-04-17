/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import TimeLimitItem, { TimeLimitItemLike } from "@entity/dto/time-limit-item"
import limitService from "@service/limit-service"
import periodService from "@service/period-service"
import timerService from "@service/timer-service"
import { ChromeMessage, ChromeResult } from "@util/message"
import CollectionContext from "./collection-context"

function sendLimitedMessage(item: TimeLimitItem[]) {
    chrome.tabs.query({ status: "complete" }, tabs => {
        tabs.forEach(tab => {
            chrome.tabs.sendMessage<ChromeMessage<TimeLimitItemLike[]>, ChromeResult>(tab.id, {
                code: "limitTimeMeet",
                data: item
            }, result => {
                if (result?.code === "fail") {
                    console.error(`Failed to execute limit rule: rule=${JSON.stringify(item)}, msg=${result.msg}`)
                } else if (result?.code === "success") {
                    console.log(`Processed limit rules: rule=${JSON.stringify(item)}`)
                }
            })
        })
    })
}

export default async function save(collectionContext: CollectionContext) {
    const context = collectionContext.timerContext
    if (context.isPaused()) return
    timerService.addFocusAndTotal(context.timeMap)
    const focusEntry = context.findFocus()

    if (focusEntry) {
        // Add period time
        periodService.add(context.lastCollectTime, focusEntry[1].focus)
        // Add limit time
        const limitedRules = await limitService.addFocusTime(collectionContext.focusHost, collectionContext.focusUrl, focusEntry[1].focus)
        // If time limited after this operation, send messages
        limitedRules && limitedRules.length && sendLimitedMessage(limitedRules)
    }
    context.resetTimeMap()
}

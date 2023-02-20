/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { listTabs, sendMsg2Tab } from "@api/chrome/tab"
import limitService from "@service/limit-service"
import periodService from "@service/period-service"
import timerService from "@service/timer-service"
import { sum } from "@util/array"
import CollectionContext from "./collection-context"

async function sendLimitedMessage(item: timer.limit.Item[]) {
    const tabs = await listTabs({ status: 'complete' })
    tabs.forEach(tab => sendMsg2Tab(tab.id, 'limitTimeMeet', item)
        .then(() => console.log(`Processed limit rules: rule=${JSON.stringify(item)}`))
        .catch(err => console.error(`Failed to execute limit rule: rule=${JSON.stringify(item)}, msg=${err.msg}`))
    )
}

export default async function save(collectionContext: CollectionContext) {
    const context = collectionContext.timerContext
    if (context.isPaused()) return
    const timeMap = context.timeMap
    timerService.addFocusAndTotal(timeMap)
    const totalFocusTime = sum(Object.values(timeMap).map(timeInfo => sum(Object.values(timeInfo))))
    // Add period time
    await periodService.add(context.lastCollectTime, totalFocusTime)
    for (const [host, timeInfo] of Object.entries(timeMap)) {
        for (const [url, focusTime] of Object.entries(timeInfo)) {
            // Add limit time
            const limitedRules = await limitService.addFocusTime(host, url, focusTime)
            // If time limited after this operation, send messages
            limitedRules && limitedRules.length && sendLimitedMessage(limitedRules)
        }
    }

    context.resetTimeMap()
}

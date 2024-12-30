/**
 * Copyright (c) 2022-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { createTabAfterCurrent, getRightOf, listTabs, resetTabUrl, sendMsg2Tab } from "@api/chrome/tab"
import { LIMIT_ROUTE } from "@app/router/constants"
import { getAppPageUrl } from "@util/constant/url"
import MessageDispatcher from "./message-dispatcher"
import { matches } from "@util/limit"
import limitService from "@service/limit-service"
import { isBrowserUrl } from "@util/pattern"
import alarmManager from "./alarm-manager"
import { getStartOfDay, MILL_PER_DAY, MILL_PER_SECOND } from "@util/time"

function processLimitWaking(rules: timer.limit.Item[], tab: ChromeTab) {
    const { url } = tab
    const anyMatch = rules.map(rule => matches(rule?.cond, url)).reduce((a, b) => a || b, false)
    if (!anyMatch) {
        return
    }
    sendMsg2Tab(tab.id, 'limitWaking', rules)
        .then(() => console.log(`Waked tab[id=${tab.id}]`))
        .catch(err => console.error(`Failed to wake with limit rule: rules=${JSON.stringify(rules)}, msg=${err.msg}`))
}

async function processOpenPage(limitedUrl: string, sender: ChromeMessageSender) {
    const originTab = sender?.tab
    if (!originTab) return
    const realUrl = getAppPageUrl(true, LIMIT_ROUTE, { url: encodeURI(limitedUrl) })
    const baseUrl = getAppPageUrl(true, LIMIT_ROUTE)
    const rightTab = await getRightOf(originTab)
    const rightUrl = rightTab?.url
    if (rightUrl && isBrowserUrl(rightUrl) && rightUrl.includes(baseUrl)) {
        // Reset url
        await resetTabUrl(rightTab.id, realUrl)
    } else {
        await createTabAfterCurrent(realUrl, sender?.tab)
    }
}

function initDailyBroadcast() {
    // Broadcast rules at the start of each day
    alarmManager.setWhen(
        'limit-daily-broadcast',
        () => {
            const startOfThisDay = getStartOfDay(new Date())
            return startOfThisDay.getTime() + MILL_PER_DAY
        },
        () => limitService.broadcastRules(),
    )
}

const processMoreMinutes = async (url: string) => {
    const rules = await limitService.moreMinutes(url)

    const tabs = await listTabs({ status: 'complete' })
    tabs.forEach(tab => processLimitWaking(rules, tab))
}

const processAskHitVisit = async (item: timer.limit.Item) => {
    let tabs = await listTabs()
    tabs = tabs?.filter(({ url }) => matches(item?.cond, url))
    const { visitTime = 0 } = item || {}
    for (const { id } of tabs) {
        const tabFocus = await sendMsg2Tab(id, "askVisitTime", undefined)
        if (tabFocus && tabFocus > visitTime * MILL_PER_SECOND) return true
    }
    return false
}

export default function init(dispatcher: MessageDispatcher) {
    initDailyBroadcast()
    dispatcher
        .register<string>('openLimitPage', processOpenPage)
        // More minutes
        .register<string>('cs.moreMinutes', processMoreMinutes)
        // Judge any tag hit the time limit per visit
        .register<timer.limit.Item, boolean>("askHitVisit", processAskHitVisit)
}
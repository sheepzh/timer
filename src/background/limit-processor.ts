/**
 * Copyright (c) 2022-present Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { createTab, listTabs, sendMsg2Tab } from "@api/chrome/tab"
import { LIMIT_ROUTE } from "@app/router/constants"
import { getAppPageUrl } from "@util/constant/url"
import MessageDispatcher from "./message-dispatcher"
import { matches } from "@util/limit"
import limitService from "@service/limit-service"

function processLimitWaking(rules: timer.limit.Item[], tab: ChromeTab) {
    const { url } = tab
    const anyMatch = rules.map(rule => matches(rule, url)).reduce((a, b) => a || b, false)
    if (!anyMatch) {
        return
    }
    sendMsg2Tab(tab.id, 'limitWaking', rules)
        .then(() => console.log(`Waked tab[id=${tab.id}]`))
        .catch(err => console.error(`Failed to wake with limit rule: rules=${JSON.stringify(rules)}, msg=${err.msg}`))
}

export default function init(dispatcher: MessageDispatcher) {
    dispatcher
        .register<string>(
            'openLimitPage',
            (url: string) => createTab(getAppPageUrl(true, LIMIT_ROUTE, { url: encodeURI(url) }))
        )
        .register<timer.limit.Item[]>(
            'limitWaking',
            async data => {
                const rules = data || []
                const tabs = await listTabs({ status: 'complete' })
                tabs.forEach(tab => processLimitWaking(rules, tab))
            }
        )
        // More minutes
        .register<string>('cs.moreMinutes', async url => {
            const rules = await limitService.moreMinutes(url)

            const tabs = await listTabs({ status: 'complete' })
            tabs.forEach(tab => processLimitWaking(rules, tab))
        })
        // Judge any tag hit the time limit per visit
        .register<timer.limit.Item, boolean>("askHitVisit", async item => {
            let tabs = await listTabs()
            tabs = tabs?.filter(({ url }) => matches(item, url))
            const { visitTime = 0 } = item || {}
            for (const { id } of tabs) {
                const tabFocus = await sendMsg2Tab(id, "askVisitTime", undefined)
                if (tabFocus && tabFocus > visitTime * 1000) return true
            }
            return false
        })
}
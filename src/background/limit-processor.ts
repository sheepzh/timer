/**
 * Copyright (c) 2022-present Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { createTab, listTabs, sendMsg2Tab } from "@api/chrome/tab"
import { LIMIT_ROUTE } from "@app/router/constants"
import TimeLimitItem from "@entity/time-limit-item"
import { getAppPageUrl } from "@util/constant/url"
import MessageDispatcher from "./message-dispatcher"

function processLimitWaking(rules: TimeLimitItem[], tab: ChromeTab) {
    const { url } = tab
    const anyMatch = rules.map(rule => rule.matches(url)).reduce((a, b) => a || b, false)
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
                const rules = data?.map(like => TimeLimitItem.of(like)) || []
                const tabs = await listTabs({ status: 'complete' })
                tabs.forEach(tab => processLimitWaking(rules, tab))
            }
        )
}
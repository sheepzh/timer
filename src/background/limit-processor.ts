/**
 * Copyright (c) 2022-present Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { LIMIT_ROUTE } from "@app/router/constants"
import TimeLimitItem from "@entity/time-limit-item"
import { getAppPageUrl } from "@util/constant/url"
import MessageDispatcher from "./message-dispatcher"

function processLimitWaking(rules: TimeLimitItem[], tab: chrome.tabs.Tab) {
    const { url } = tab
    const anyMatch = rules.map(rule => rule.matches(url)).reduce((a, b) => a || b, false)
    if (!anyMatch) {
        return
    }
    chrome.tabs.sendMessage<timer.mq.Request<timer.limit.Item[]>, timer.mq.Response>(tab.id, {
        code: "limitWaking",
        data: rules
    }, result => {
        if (result?.code === "fail") {
            console.error(`Failed to wake with limit rule: rules=${JSON.stringify(rules)}, msg=${result.msg}`)
        } else if (result?.code === "success") {
            console.log(`Waked tab[id=${tab.id}]`)
        }
    })
}

export default function init(dispatcher: MessageDispatcher) {
    dispatcher
        .register<string>(
            'openLimitPage',
            async (url: string) => {
                const pageUrl = getAppPageUrl(true, LIMIT_ROUTE, { url: encodeURI(url) })
                chrome.tabs.create({ url: pageUrl })
            }
        )
        .register<timer.limit.Item[]>(
            'limitWaking',
            async data => {
                const rules = (data || [])
                    .map(like => TimeLimitItem.of(like))
                chrome.tabs.query({ status: "complete" }, tabs => {
                    tabs.forEach(tab => processLimitWaking(rules, tab))
                })
            }
        )
}
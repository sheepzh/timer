/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { getAppPageUrl } from "@util/constant/url"
import { LIMIT_ROUTE } from "../app/router/constants"
import TimeLimitItem from "@entity/dto/time-limit-item"

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

function listen(message: timer.mq.Request<any>, _sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) {
    if (message.code === 'openLimitPage') {
        const url: string = message.data as string
        const pageUrl = getAppPageUrl(true, LIMIT_ROUTE, { url: encodeURI(url) })
        chrome.tabs.create({ url: pageUrl })
    } else if (message.code === "limitWaking") {
        const rules = (message.data as timer.limit.Item[] || [])
            .map(like => TimeLimitItem.of(like))
        chrome.tabs.query({ status: "complete" }, tabs => {
            tabs.forEach(tab => processLimitWaking(rules, tab))
        })
    }
    sendResponse('ok')
}

export default class MessageListener {
    listen() {
        chrome.runtime.onMessage.addListener(listen)
    }
}
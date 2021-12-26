/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { getAppPageUrl } from "@util/constant/url"
import { LIMIT_ROUTE } from "../app/router/constants"
import { ChromeMessage } from "@util/message"

function listen<T>(message: ChromeMessage<T>, _sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) {
    if (message.code === 'openLimitPage') {
        const data: T = message.data
        const url = data ? data.toString() : ''
        const pageUrl = `${getAppPageUrl(true)}#${LIMIT_ROUTE}?url=${encodeURI(url)}`
        chrome.tabs.create({ url: pageUrl })
    }
    sendResponse('ok')
}

export default class MessageListener {
    listen() {
        chrome.runtime.onMessage.addListener(listen)
    }
}
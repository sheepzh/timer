import { LIMIT_ROUTE } from "../common/constants"
import { APP_PAGE_URL } from "../util/constant/url"
import { ChromeMessage } from "../util/message"

function listen<T>(message: ChromeMessage<T>, _sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) {
    if (message.code === 'openLimitPage') {
        const data: T = message.data
        const url = data ? data.toString() : ''
        const pageUrl = `${APP_PAGE_URL}#${LIMIT_ROUTE}?url=${encodeURI(url)}`
        chrome.tabs.create({ url: pageUrl })
    }
    sendResponse('ok')
}

export default class MessageListener {
    listen() {
        chrome.runtime.onMessage.addListener(listen)
    }
}
/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import TimeLimitItem from "@entity/dto/time-limit-item"
import limitService from "@service/limit-service"
import { t2Chrome } from "@util/i18n/chrome/t"

class _Modal {
    url: string
    mask: HTMLDivElement
    delayContainer: HTMLParagraphElement
    visible: boolean = false
    constructor(url: string) {
        this.mask = document.createElement('div')
        this.mask.id = "_timer_mask"
        this.mask.append(link2Setup(url))
        this.url = url
        Object.assign(this.mask.style, maskStyle)
    }

    showModal(showDelay: boolean) {
        const _thisUrl = this.url
        if (showDelay && this.mask.childElementCount === 1) {
            this.delayContainer = document.createElement('p')
            this.delayContainer.style.marginTop = '100px'

            // Only delay-allowed rules exist, can delay
            // @since 0.4.0
            const link = document.createElement('a')
            Object.assign(link.style, linkStyle)
            link.setAttribute('href', 'javascript:void(0)')
            const text = t2Chrome(msg => msg.message.more5Minutes)
            link.innerText = text
            link.onclick = async () => {
                const delayRules = await limitService.moreMinutes(_thisUrl)
                const wakingRules = delayRules
                    .map(like => TimeLimitItem.of(like))
                    .filter(rule => !rule.hasLimited())
                chrome.runtime.sendMessage<timer.mq.Request<timer.limit.Item[]>, timer.mq.Response>(wakingMessage(wakingRules))
                this.hideModal()
            }
            this.delayContainer.append(link)
            this.mask.append(this.delayContainer)
        }
        if (this.visible) {
            return
        }
        document.body.append(this.mask)
        document.body.style.overflow = 'hidden'
        this.visible = true
    }

    hideModal() {
        if (!this.visible) {
            return
        }
        this.mask.remove()
        document.body.style.overflow = ''
        this.visible = false
    }

    process(data: TimeLimitItem[]) {
        const anyMatch = data.map(item => item.matches(this.url)).reduce((a, b) => a || b)
        if (anyMatch) {
            const anyDelay = data.map(item => item.matches(this.url) && item.allowDelay).reduce((a, b) => a || b)
            this.showModal(anyDelay)
        }
    }

    isVisible(): boolean {
        return !!this.visible
    }
}

function wakingMessage(rules: timer.limit.Item[]): timer.mq.Request<timer.limit.Item[]> {
    return { code: 'limitWaking', data: rules }
}

const maskStyle: Partial<CSSStyleDeclaration> = {
    width: "100%",
    height: "100%",
    position: "fixed",
    zIndex: '99999',
    backgroundColor: '#444',
    opacity: '0.9',
    display: 'block',
    top: '0px',
    left: '0px',
    textAlign: 'center',
    paddingTop: '120px'
}

const linkStyle: Partial<CSSStyleDeclaration> = {
    color: '#EEE',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei","Helvetica Neue",Helvetica,Arial,sans-serif',
    fontSize: '16px !important'
}

function openLimitPageMessage(url: string): timer.mq.Request<string> {
    return { code: 'openLimitPage', data: encodeURIComponent(url) }
}

function link2Setup(url: string): HTMLParagraphElement {
    const link = document.createElement('a')
    Object.assign(link.style, linkStyle)
    link.setAttribute('href', 'javascript:void(0)')
    const text = t2Chrome(msg => msg.message.timeLimitMsg)
        .replace('{appName}', t2Chrome(msg => msg.app.name))
    link.innerText = text
    link.onclick = () => chrome.runtime.sendMessage(openLimitPageMessage(url))
    const p = document.createElement('p')
    p.append(link)
    return p
}

export default async function processLimit(url: string) {
    const modal = new _Modal(url)
    const limitedRules: TimeLimitItem[] = await limitService.getLimited(url)
    if (limitedRules?.length) {
        window.onload = () => modal.showModal(!!limitedRules?.filter?.(item => item.allowDelay).length)
    }
    chrome.runtime.onMessage.addListener((msg: timer.mq.Request<timer.limit.Item[]>, _sender, sendResponse: timer.mq.Callback) => {
        if (msg.code !== "limitTimeMeet") {
            sendResponse({ code: "ignore" })
            return
        }
        const itemLikes: timer.limit.Item[] = msg.data
        if (!itemLikes) {
            sendResponse({ code: "fail", msg: "Empty time limit item" })
            return
        }
        const items = itemLikes.map(itemLike => TimeLimitItem.of(itemLike))
        modal.process(items)
        sendResponse({ code: "success" })
    })
    chrome.runtime.onMessage.addListener((msg: timer.mq.Request<timer.limit.Item[]>, _sender, sendResponse: timer.mq.Callback) => {
        if (msg.code !== "limitWaking") {
            sendResponse({ code: "ignore" })
            return
        }
        if (!modal.isVisible()) {
            sendResponse({ code: "ignore" })
            return
        }
        const itemLikes: timer.limit.Item[] = msg.data
        if (!itemLikes || !itemLikes.length) {
            sendResponse({ code: "success", msg: "Empty time limit item" })
            return
        }
        const items = itemLikes.map(itemLike => TimeLimitItem.of(itemLike))
        for (let index in items) {
            const item = items[index]
            if (item.matches(modal.url) && !item.hasLimited()) {
                modal.hideModal()
                break
            }
        }
        sendResponse({ code: "success" })
    })
}


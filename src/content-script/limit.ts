/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import TimeLimitItem from "@entity/time-limit-item"
import optionService from "@service/option-service"
import { t2Chrome } from "@i18n/chrome/t"
import { t } from "./locale"
import { onRuntimeMessage, sendMsg2Runtime } from "@api/chrome/runtime"

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
        this.initStyle()
    }

    private async initStyle() {
        const filterType = (await optionService.getAllOption())?.limitMarkFilter
        const realMaskStyle = {
            ...maskStyle,
            ...filterStyle[filterType || 'translucent']
        }
        Object.assign(this.mask.style, realMaskStyle)
    }

    showModal(showDelay: boolean) {
        if (!document.body) {
            return
        }
        const _thisUrl = this.url
        if (showDelay && this.mask.childElementCount === 1) {
            this.delayContainer = document.createElement('p')
            this.delayContainer.style.marginTop = '100px'

            // Only delay-allowed rules exist, can delay
            // @since 0.4.0
            const link = document.createElement('a')
            Object.assign(link.style, linkStyle)
            link.setAttribute('href', 'javascript:void(0)')
            const text = t(msg => msg.more5Minutes)
            link.innerText = text
            link.onclick = async () => {
                const delayRules: timer.limit.Item[] = await sendMsg2Runtime('cs.moreMinutes', _thisUrl)
                const wakingRules = delayRules
                    .map(like => TimeLimitItem.of(like))
                    .filter(rule => !rule.hasLimited())
                sendMsg2Runtime('limitWaking', wakingRules)
                this.hideModal()
            }
            this.delayContainer.append(link)
            this.mask.append(this.delayContainer)
        } else if (!showDelay && this.mask.childElementCount === 2) {
            this.mask.children?.[1]?.remove?.()
        }
        if (this.visible) {
            return
        }
        document.body.append(this.mask)
        document.body.style.overflow = 'hidden'
        this.visible = true
    }

    hideModal() {
        if (!this.visible || !document.body) {
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

const maskStyle: Partial<CSSStyleDeclaration> = {
    width: "100%",
    height: "100%",
    position: "fixed",
    zIndex: '99999',
    display: 'block',
    top: '0px',
    left: '0px',
    textAlign: 'center',
    paddingTop: '120px'
}

const filterStyle: Record<timer.limit.FilterType, Partial<CSSStyleDeclaration & { backdropFilter: string }>> = {
    translucent: {
        backgroundColor: '#444',
        opacity: '0.9',
        color: '#EEE',
    },
    groundGlass: {
        backdropFilter: 'blur(5px)',
        color: '#111',
    }
}

const linkStyle: Partial<CSSStyleDeclaration> = {
    color: 'inherit',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei","Helvetica Neue",Helvetica,Arial,sans-serif',
    fontSize: '16px !important'
}

function link2Setup(url: string): HTMLParagraphElement {
    const link = document.createElement('a')
    Object.assign(link.style, linkStyle)
    link.setAttribute('href', 'javascript:void(0)')
    const text = t(msg => msg.timeLimitMsg)
        .replace('{appName}', t2Chrome(msg => msg.meta.name))
    link.innerText = text
    link.onclick = () => sendMsg2Runtime('openLimitPage', encodeURIComponent(url))
    const p = document.createElement('p')
    p.append(link)
    return p
}

async function handleLimitTimeMeet(msg: timer.mq.Request<timer.limit.Item[]>, modal: _Modal): Promise<timer.mq.Response> {
    if (msg.code !== "limitTimeMeet") {
        return { code: "ignore" }
    }
    const itemLikes: timer.limit.Item[] = msg.data
    if (!itemLikes) {
        return { code: "fail", msg: "Empty time limit item" }
    }
    const items = itemLikes.map(itemLike => TimeLimitItem.of(itemLike))
    modal.process(items)
    return { code: "success" }
}

async function handleLimitWaking(msg: timer.mq.Request<timer.limit.Item[]>, modal: _Modal): Promise<timer.mq.Response> {
    if (msg.code !== "limitWaking") {
        return { code: "ignore" }
    }
    if (!modal.isVisible()) {
        return { code: "ignore" }
    }
    const itemLikes: timer.limit.Item[] = msg.data
    if (!itemLikes || !itemLikes.length) {
        return { code: "success", msg: "Empty time limit item" }
    }
    const items = itemLikes.map(itemLike => TimeLimitItem.of(itemLike))
    for (let index in items) {
        const item = items[index]
        if (item.matches(modal.url) && !item.hasLimited()) {
            modal.hideModal()
            break
        }
    }
    return { code: "success" }
}

async function handleLimitChanged(msg: timer.mq.Request<timer.limit.Item[]>, modal: _Modal): Promise<timer.mq.Response> {
    if (msg.code === 'limitChanged') {
        const data: timer.limit.Item[] = msg.data
        const items = data.map(TimeLimitItem.of)
        items?.length ? modal.process(items) : modal.hideModal()
        return { code: 'success' }
    } else {
        return { code: 'ignore' }
    }
}

export default async function processLimit(url: string) {
    const modal = new _Modal(url)
    const limitedRules: timer.limit.Item[] = await sendMsg2Runtime('cs.getLimitedRules', url)
    if (limitedRules?.length) {
        window.onload = () => modal.showModal(!!limitedRules?.filter?.(item => item.allowDelay).length)
    }
    onRuntimeMessage<timer.limit.Item[], void>(msg => handleLimitTimeMeet(msg, modal))
    onRuntimeMessage<timer.limit.Item[], void>(msg => handleLimitChanged(msg, modal))
    onRuntimeMessage<timer.limit.Item[], void>(msg => handleLimitWaking(msg, modal))
}


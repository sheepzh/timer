import { t } from "../locale"
import { t2Chrome } from "@i18n/chrome/t"
import { LimitReason, LimitType, MaskModal } from "./common"
import { sendMsg2Runtime } from "@api/chrome/runtime"
import optionService from "@service/option-service"
import { FILTER_STYLES, LINK_STYLE, MASK_STYLE } from "./modal-style"

const TYPE_SORT: { [reason in LimitType]: number } = {
    PERIOD: 0,
    VISIT: 1,
    DAILY: 2,
}

function limitAlert(reason: LimitReason): HTMLParagraphElement {
    let text = ""
    const { type } = reason || {}
    if (type === "DAILY") {
        text = t(msg => msg.timeLimitMsg)
    } else if (type === "VISIT") {
        text = t(msg => msg.visitLimitMsg)
    } else if (type === "PERIOD") {
        text = t(msg => msg.periodLimitMsg)
    }

    const p = document.createElement('p')

    Object.assign(p.style || {}, LINK_STYLE)
    p.innerText = text
    return p
}

function link2Setup(url: string): HTMLParagraphElement {
    const refText = t(msg => msg.limitRefMsg).replace('{appName}', t2Chrome(msg => msg.meta.name))

    const link = document.createElement('a')
    Object.assign(link.style || {}, LINK_STYLE)
    link.setAttribute('href', 'javascript:void(0)')

    link.innerText = refText
    link.onclick = () => sendMsg2Runtime('openLimitPage', encodeURIComponent(url))
    const p = document.createElement('p')
    p.append(link)
    return p
}

function exitScreen(): Promise<void> {
    const ele = document.fullscreenElement
    if (!ele) {
        return Promise.resolve()
    }
    return new Promise<void>(resolve => {
        if (document.exitFullscreen) {
            document.exitFullscreen()
                .then(resolve)
                .catch(e => console.warn("Failed to exit fullscreen", e))
        } else {
            resolve()
        }
    })
}

function isSameReason(a: LimitReason, b: LimitReason): boolean {
    let same = a?.cond === b?.cond && a?.type === b?.type
    if (!same) return false
    if (a?.type === "DAILY" || a?.type === "VISIT") {
        // Need judge allow delay
        same = same && a?.allowDelay === b?.allowDelay
    }
    return same
}

class ModalInstance implements MaskModal {
    url: string
    reasons: LimitReason[] = []
    displayReason: LimitReason
    mask: HTMLDivElement
    delayHandlers: (() => void)[] = [
        () => sendMsg2Runtime('cs.moreMinutes', this.url)
    ]

    constructor(url: string) {
        this.url = url
        this.mask = document.createElement('div')
        this.mask.id = "_timer_mask"
        this.initStyle()
        window?.addEventListener?.("load", () => this.refresh())
    }

    addDelayHandler(handler: () => void): void {
        if (!handler) return
        if (this.delayHandlers?.includes(handler)) return
        this.delayHandlers?.push(handler)
    }

    private async initStyle() {
        const filterType = (await optionService.getAllOption())?.limitFilter
        const realMaskStyle = {
            ...MASK_STYLE,
            ...FILTER_STYLES[filterType || 'translucent']
        }
        Object.assign(this.mask.style || {}, realMaskStyle)
    }

    addReason(reason: LimitReason): void {
        const exist = this.reasons.find(r => isSameReason(r, reason))
        if (exist) return
        this.reasons.push(reason)
        // Sort
        this.reasons.sort((a, b) => TYPE_SORT[a.type] - TYPE_SORT[b.type])
        this.refresh()
    }

    private refresh() {
        if (!document.body) return

        const newReason = this.reasons[0]
        if (isSameReason(newReason, this.displayReason)) {
            // do nothing
            return
        }
        this.displayReason = newReason
        if (newReason) {
            // Exist full screen at first
            exitScreen().then(() => this.showModalInner(this.displayReason))
        } else {
            this.hideModal()
        }
    }

    removeReason(reason: LimitReason): void {
        const beforeCount = this.reasons.length
        this.reasons = this.reasons.filter(r => !isSameReason(r, reason))
        const afterCount = this.reasons.length
        beforeCount !== afterCount && this.refresh()
    }

    removeReasonsByType(type: LimitType): void {
        const beforeCount = this.reasons.length
        this.reasons = this.reasons.filter(r => r.type !== type)
        const afterCount = this.reasons.length
        beforeCount !== afterCount && this.refresh()
    }

    removeReasonsByTypeAndCond(type: LimitType, cond: string): void {
        const beforeCount = this.reasons.length
        this.reasons = this.reasons.filter(r => !(r.type === type && r.cond === cond))
        const afterCount = this.reasons.length
        beforeCount !== afterCount && this.refresh()
    }

    private showModalInner(reason: LimitReason): any {
        const url = this.url
        const { allowDelay, type } = reason

        // Clear
        Array.from(this.mask.children).forEach(e => e.remove())
        // Append alert and link
        this.mask.append(limitAlert(reason))
        this.mask.append(document.createElement("br"))
        this.mask.append(link2Setup(url))

        const canDelay = (type === "DAILY" || type === "VISIT") && allowDelay

        if (canDelay) {
            const delayContainer = document.createElement('p')
            delayContainer.style.marginTop = '100px'

            // Only delay-allowed rules exist, can delay
            // @since 0.4.0
            const link = document.createElement('a')
            Object.assign(link.style || {}, LINK_STYLE)
            link.setAttribute('href', 'javascript:void(0)')
            const text = t(msg => msg.more5Minutes)
            link.innerText = text
            link.onclick = () => [
                this.delayHandlers?.forEach(h => h?.())
            ]
            delayContainer.append(link)
            this.mask.append(delayContainer)
        }

        document.body.append(this.mask)
        document.body.style.overflow = 'hidden'
    }

    private hideModal() {
        if (!document.body) {
            return
        }
        this.mask.remove()
        document.body.style.overflow = ''
    }
}

export default ModalInstance
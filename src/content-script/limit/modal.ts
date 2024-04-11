import { t } from "../locale"
import { t2Chrome } from "@i18n/chrome/t"
import { LimitReason, LimitType, MaskModal } from "./common"
import { getRuntimeId, sendMsg2Runtime } from "@api/chrome/runtime"
import optionService from "@service/option-service"
import { FILTER_STYLES, LINK_STYLE, MASK_STYLE } from "./modal-style"
import { DelayConfirm } from "./delay/confirm"
import { DelayButton } from "./delay/button"

const TYPE_SORT: { [reason in LimitType]: number } = {
    PERIOD: 0,
    VISIT: 1,
    DAILY: 2,
}

const MASK_ID = "_timer_mask_" + getRuntimeId()

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

async function exitScreen(): Promise<void> {
    const ele = document.fullscreenElement
    if (!ele) return
    try {
        await document.exitFullscreen?.()
    } catch (e) {
        console.warn("Failed to exit fullscreen", e)
    }
}

function isSameReason(a: LimitReason, b: LimitReason): boolean {
    let same = a?.id === b?.id && a?.type === b?.type
    if (!same) return false
    if (a?.type === "DAILY" || a?.type === "VISIT") {
        // Need judge allow delay
        same = same && a?.allowDelay === b?.allowDelay
    }
    return same
}

const canDelay = ({ allowDelay, type }: LimitReason, options: timer.option.DailyLimitOption) => allowDelay
    && (type === "DAILY" || type === "VISIT")
    && options.limitLevel !== "strict"

class ModalInstance implements MaskModal {
    url: string
    reasons: LimitReason[] = []
    displayReason: LimitReason
    mask: HTMLDivElement
    delayHandlers: (() => void)[] = [
        () => sendMsg2Runtime('cs.moreMinutes', this.url)
    ]
    options: timer.option.AllOption
    locked: boolean = false
    observer: MutationObserver

    constructor(url: string) {
        this.url = url
        this.initObserver()
        window?.addEventListener?.("load", () => this.refresh())
        optionService.getAllOption().then(val => {
            this.options = val
            this.initMask()
        })
        optionService.addOptionChangeListener(val => this.options = val)
    }

    private initMask() {
        this.mask?.remove?.()
        this.mask = document.createElement('div')
        this.mask.id = MASK_ID
        const filterType = this.options?.limitFilter
        const realMaskStyle = {
            ...MASK_STYLE,
            ...FILTER_STYLES[filterType || 'translucent']?.mask || {}
        }
        Object.assign(this.mask.style || {}, realMaskStyle)
    }

    private initObserver() {
        this.observer = new MutationObserver(mutations => {
            const isSensitive = !!mutations?.some?.(m => {
                const { target, removedNodes } = m || {}
                return target === this.mask
                    || Array.from(removedNodes || []).some(m => m === this.mask)
            })
            if (!isSensitive) return
            this.observer.disconnect()
            this.displayReason = null
            this.initMask()
            this.refresh()
        })
    }

    addDelayHandler(handler: () => void): void {
        if (!handler) return
        if (this.delayHandlers?.includes(handler)) return
        this.delayHandlers?.push(handler)
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

    private showModalInner(reason: LimitReason): void {
        this.observer.disconnect()
        const url = this.url

        // Clear
        Array.from(this.mask.children).forEach(e => e.remove())
        // Append alert and link
        this.mask.append(limitAlert(reason))
        this.mask.append(document.createElement("br"))
        this.mask.append(link2Setup(url))

        if (canDelay(reason, this.options)) {
            const delayConfirm = new DelayConfirm(this.options)
            const delayButton = new DelayButton(
                () => delayConfirm.doConfirm().then(() => this.delayHandlers?.forEach?.(h => h?.()))
            )
            this.mask.append(delayButton.dom)
            delayConfirm.dom && this.mask.append(delayConfirm.dom)
        }

        document.body.append(this.mask)
        document.body.style.overflow = 'hidden'
        this.observer.observe(this.mask, { attributes: true, characterData: true })
        this.observer.observe(document.body, { childList: true })
    }

    private hideModal() {
        if (!document.body) {
            return
        }
        this.observer.disconnect()
        this.mask.remove()
        document.body.style.overflow = ''
    }
}

export default ModalInstance
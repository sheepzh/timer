import { t } from "@src/content-script/locale"
import { LINK_STYLE } from "../modal-style"

export class DelayButton {
    public dom: HTMLDivElement

    constructor(onClick: () => void) {
        this.dom = document.createElement('p')
        this.dom.style.marginTop = '100px'

        // Only delay-allowed rules exist, can delay
        // @since 0.4.0
        const link = document.createElement('a')
        Object.assign(link.style || {}, LINK_STYLE)
        link.setAttribute('href', 'javascript:void(0)')
        const text = t(msg => msg.more5Minutes)
        link.innerText = text
        link.onclick = onClick
        this.dom.append(link)
    }
}
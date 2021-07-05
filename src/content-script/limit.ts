import TimeLimitItem from "../entity/dto/time-limit-item"
import limitService from "../service/limit-service"
import { t2Chrome } from "../util/i18n/chrome/t"
import { ChromeMessage } from "../util/message"

const maskStyle: Partial<CSSStyleDeclaration> = {
    width: "100%",
    height: "100%",
    position: "absolute",
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

function messageCode(url: string): ChromeMessage<string> {
    return { code: 'openLimitPage', data: encodeURIComponent(url) }
}

function generateMask(url: string): HTMLDivElement {
    const modalMask = document.createElement('div')
    const link = document.createElement('a')
    Object.assign(link.style, linkStyle)
    link.setAttribute('href', 'javascript:void(0)')
    const text = t2Chrome(msg => msg.message.timeLimitMsg)
        .replace('{appName}', t2Chrome(msg => msg.app.name))
    link.innerText = text
    link.onclick = () => chrome.runtime.sendMessage(messageCode(url))
    modalMask.id = "_timer_mask"
    modalMask.append(link)
    Object.assign(modalMask.style, maskStyle)
    return modalMask
}

export default async function processLimit(url: string) {
    const limittedRules: TimeLimitItem[] = await limitService.getLimitted(url)
    if (!limittedRules.length) return
    const mask = generateMask(url)
    window.onload = () => {
        document.body.append(mask)
        document.body.style.overflow = 'hidden'
    }
}


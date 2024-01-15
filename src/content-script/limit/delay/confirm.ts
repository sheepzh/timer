import { VerificationPair } from "@service/limit-service/verification/common"
import verificationProcessor from "@service/limit-service/verification/processor"
import { LINK_STYLE } from "../modal-style"
import { t as t_, locale, I18nKey, tN as tN_, I18nResultItem } from "@i18n"
import { LimitMessage, verificationMessages } from "@i18n/message/app/limit"

const tV = (key: I18nKey<LimitMessage['verification']>, param?: any) => {
    return t_(verificationMessages, { key, param })
}

const tVN = (key: I18nKey<LimitMessage['verification']>, param?: any) => {
    return tN_<LimitMessage['verification'], HTMLElement>(verificationMessages, { key, param })
}

const generatePromptEle = (text: string): HTMLElement => {
    const b = document.createElement('b')
    b.innerText = text
    const style: Partial<CSSStyleDeclaration> = {
        userSelect: "none",
    }
    Object.assign(b.style || {}, style)
    return b
}

const ANSWER_CANVAS_FONT_SIZE = 20

const generatePromptCanvas = (text: string): HTMLCanvasElement => {
    const ele = document.createElement('canvas')
    const ctx = ele.getContext("2d")
    const height = Math.floor(ANSWER_CANVAS_FONT_SIZE * 1.3)
    ele.height = height
    const font = LINK_STYLE.fontFamily
    // Set font to measure width
    ctx.font = font
    const { width } = ctx.measureText(text)
    ele.width = width
    // Need set font again after width changed
    ctx.font = font
    ctx.fillStyle = 'rgb(238, 238, 238)'
    ctx.fillText(text, 0, ANSWER_CANVAS_FONT_SIZE)
    return ele
}

const CONFIRM_STYLE: Partial<CSSStyleDeclaration> = {
    width: "500px",
    left: "calc(50vw - 250px)",
    top: "200px",
    height: "250px",
    padding: "50px 20px 20px 20px",
    position: "absolute",
    textAlign: "center",
    background: "#111",
    borderRadius: "8px",
}

const INPUT_STYLE: Partial<CSSStyleDeclaration> = {
    color: "#000",
    padding: "2px 6px",
    borderRadius: "2px",
    marginTop: "20px",
    width: "200px",
    border: "none",
    outline: "none",
}

const FOOT_STYLE: Partial<CSSStyleDeclaration> = {
    display: "flex",
    marginTop: "20px",
    justifyContent: "center",
}

const FOOT_BTN_STYLE: Partial<CSSStyleDeclaration> = {
    cursor: "pointer",
    padding: "5px 10px",
    textDecoration: "underline",
}

const createFooterBtn = (text: string, onClick: () => void): HTMLDivElement => {
    const btn = document.createElement('div')
    btn.innerText = text
    Object.assign(btn.style || {}, FOOT_BTN_STYLE)
    btn.addEventListener('click', onClick)
    return btn
}

export class DelayConfirm {
    public dom: HTMLDivElement
    private incorrectMessage: string
    private answerValue: string
    private isPassword: boolean = false
    private input: HTMLInputElement
    private visible = false
    private onSuccess: () => void
    private onError: (msg: string) => void

    constructor(option: timer.option.DailyLimitOption) {
        const { limitLevel = "nothing", limitPassword, limitVerifyDifficulty } = option || {}
        let tips: I18nResultItem<HTMLElement>[] = []
        if (limitLevel === "password" && limitPassword) {
            this.answerValue = limitPassword
            this.isPassword = true
            tips.push(tV(msg => msg.pswInputTip))
            this.incorrectMessage = tV(msg => msg.incorrectPsw)
        } else if (limitLevel === "verification") {
            const pair: VerificationPair = verificationProcessor.generate(limitVerifyDifficulty, locale)
            const { prompt, promptParam, answer } = pair || {}
            this.answerValue = typeof answer === 'function' ? tV(answer) : answer
            this.incorrectMessage = tV(msg => msg.incorrectAnswer)
            if (prompt) {
                const promptTxt = typeof prompt === 'function'
                    ? tV(prompt, { ...promptParam, answer: this.answerValue })
                    : prompt
                tips = tVN(msg => msg.inputTip, { prompt: generatePromptEle(promptTxt) })
            } else {
                const answer: HTMLElement = limitVerifyDifficulty === 'disgusting'
                    ? generatePromptCanvas(this.answerValue)
                    : generatePromptEle(this.answerValue)
                tips = tVN(msg => msg.inputTip2, { answer })
            }
        } else {
            return
        }
        this.dom = document.createElement("div")
        Object.assign(this.dom.style || {}, CONFIRM_STYLE)
        this.dom.style.display = 'none'
        // tips
        const tipContainer = document.createElement('div')
        tipContainer.append(...tips)
        this.dom.append(tipContainer)
        this.initInput()
        this.initFooter()
    }

    private initInput() {
        this.input = document.createElement('input')
        this.input.addEventListener("keypress", e => e?.key === "Enter" && this.handleConfirmClick())
        Object.assign(this.input.style || {}, INPUT_STYLE)
        this.isPassword && (this.input.type = 'password')
        this.dom.append(this.input)
    }

    private initFooter() {
        const footer = document.createElement('div')
        Object.assign(footer.style || {}, FOOT_STYLE)
        const cancelBtn = createFooterBtn('Cancel', () => this.hide())
        const confirmBtn = createFooterBtn('Confirm', () => this.handleConfirmClick())
        footer.append(confirmBtn)
        footer.append(cancelBtn)
        this.dom.append(footer)
    }

    private show() {
        if (this.visible) return
        this.visible = true
        this.dom?.style && (this.dom.style.display = "inherit")
        this.input?.focus?.()
    }

    private hide() {
        if (!this.visible) return
        this.visible = false
        this.onSuccess = undefined
        this.onError = undefined
        this.dom?.style && (this.dom.style.display = "none")
    }

    private handleConfirmClick() {
        const inputValue = this.input.value
        if (inputValue === this.answerValue) {
            this.onSuccess?.()
        } else {
            this.onError?.(this.incorrectMessage)
        }
    }

    async doConfirm(): Promise<void> {
        if (!this.dom) return Promise.resolve()
        return new Promise<void>((resolve) => {
            this.onSuccess = resolve
            this.onError = msg => alert(msg)
            this.show()
        })
    }
}


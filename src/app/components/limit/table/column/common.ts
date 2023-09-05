import { t, tN } from "@app/locale"
import { locale } from "@i18n"
import { VerificationPair } from "@service/limit-service/verification/common"
import verificationProcessor from "@service/limit-service/verification/processor"
import { getCssVariable } from "@util/style"
import { ElMessageBox, ElMessage } from "element-plus"
import { defineComponent, h, onMounted, ref, VNode } from "vue"

/**
 * Judge wether verification is required
 * 
 * @returns T/F
 */
export function judgeVerificationRequired(item: timer.limit.Item): boolean {
    const { waste, time } = item || {}
    return !!(waste > time * 1000)
}

const PROMT_TXT_CSS: Partial<CSSStyleDeclaration> = {
    userSelect: 'none',
}

const ANSWER_CANVAS_FONT_SIZE = 24

const CANVAS_WRAPPER_CSS: Partial<CSSStyleDeclaration> = {
    fontSize: `${ANSWER_CANVAS_FONT_SIZE}px`,
    textAlign: 'center',
}

const AnswerCanvas = defineComponent({
    props: {
        text: String
    },
    setup: (props => {
        const dom = ref<HTMLCanvasElement>()
        const wrapper = ref<HTMLDivElement>()
        const { text } = props

        onMounted(() => {
            const ele = dom.value
            const ctx = ele.getContext("2d")
            const height = Math.floor(ANSWER_CANVAS_FONT_SIZE * 1.3)
            ele.height = height
            const font = getComputedStyle(wrapper.value).font
            // Set font to measure width
            ctx.font = font
            const { width } = ctx.measureText(text)
            ele.width = width
            // Need set font again after width changed
            ctx.font = font
            const color = getCssVariable("--el-text-color-primary")
            ctx.fillStyle = color
            ctx.fillText(text, 0, ANSWER_CANVAS_FONT_SIZE)
        })

        return () => h('div', {
            style: CANVAS_WRAPPER_CSS,
            ref: wrapper,
        }, h('canvas', { ref: dom }))
    })
})

/**
 * @returns null if verification not required, 
 *          or promise with resolve invocked only if verification code or password correct
 */
export async function processVerification(option: timer.option.DailyLimitOption): Promise<void> {
    const { limitLevel, limitPassword, limitVerifyDifficulty } = option
    let answerValue: string
    let messageNodes: (VNode | string)[]
    let incrorectMessage: string
    if (limitLevel === 'password' && limitPassword) {
        answerValue = limitPassword
        messageNodes = [t(msg => msg.limit.verification.pswInputTip)]
        incrorectMessage = t(msg => msg.limit.verification.incorrectPsw)
    } else if (limitLevel === 'verification') {
        const pair: VerificationPair = verificationProcessor.generate(limitVerifyDifficulty, locale)
        const { prompt, promptParam, answer } = pair || {}
        answerValue = typeof answer === 'function' ? t(msg => answer(msg.limit.verification)) : answer
        incrorectMessage = t(msg => msg.limit.verification.incorrectAnswer)
        if (prompt) {
            const promptTxt = typeof prompt === 'function'
                ? t(msg => prompt(msg.limit.verification), { ...promptParam, answer: answerValue })
                : prompt
            messageNodes = tN(msg => msg.limit.verification.inputTip, { prompt: h('b', promptTxt) })
        } else {
            const answer: VNode = limitVerifyDifficulty === 'disgusting'
                ? h(AnswerCanvas, { text: answerValue })
                : h('b', answerValue)
            messageNodes = tN(msg => msg.limit.verification.inputTip2, { answer })
        }
    }
    return messageNodes?.length && answerValue
        ? new Promise(resolve =>
            ElMessageBox({
                boxType: 'prompt',
                type: 'warning',
                title: '',
                message: h('div', { style: PROMT_TXT_CSS }, messageNodes),
                showInput: true,
                showCancelButton: true,
                showClose: true,
            }).then(data => {
                const { value } = data
                if (value === answerValue) {
                    return resolve()
                }
                ElMessage.error(incrorectMessage)
            })
        )
        : null
}

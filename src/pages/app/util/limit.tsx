import { sendMsg2Runtime } from "@api/chrome/runtime"
import I18nNode from "@app/components/common/I18nNode"
import { t } from "@app/locale"
import { locale } from "@i18n"
import { getCssVariable } from "@pages/util/style"
import { type VerificationPair } from "@service/limit-service/verification/common"
import verificationProcessor from "@service/limit-service/verification/processor"
import { dateMinute2Idx, hasLimited, isEnabledAndEffective } from "@util/limit"
import { ElMessage, ElMessageBox, type ElMessageBoxOptions } from "element-plus"
import { defineComponent, onMounted, ref, type VNode } from "vue"

/**
 * Judge wether verification is required
 *
 * @returns T/F
 */
export async function judgeVerificationRequired(item: timer.limit.Item): Promise<boolean> {
    if (!isEnabledAndEffective(item)) return false

    const { visitTime, periods } = item
    // Daily or weekly
    if (hasLimited(item)) return true
    // Period
    if (periods?.length) {
        const idx = dateMinute2Idx(new Date())
        const hitPeriod = periods?.some(([s, e]) => s <= idx && e >= idx)
        if (hitPeriod) return true
    }
    // Visit
    if (visitTime) {
        let hitVisit = false
        try {
            hitVisit = await sendMsg2Runtime("askHitVisit", item)
        } catch (e) {
            // If error occurs, regarded as not hitting
            // ignored
        }
        if (hitVisit) return true
    }
    return false
}


const ANSWER_CANVAS_FONT_SIZE = 24

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

        return () => (
            <div
                style={{
                    fontSize: `${ANSWER_CANVAS_FONT_SIZE}px`,
                    textAlign: 'center'
                }}
                ref={wrapper}
            >
                <canvas ref={dom} />
            </div>
        )
    })
})

/**
 * NOT TO return Promise.resolve()
 *
 * NOT TO use async
 *
 * @returns null if verification not required,
 *          or promise with resolve invoked only if verification code or password correct
 */
export function processVerification(option: timer.option.LimitOption, context?: Pick<ElMessageBoxOptions, 'appendTo'>): Promise<void> {
    const { limitLevel, limitPassword, limitVerifyDifficulty } = option
    const { appendTo } = context || {}
    if (limitLevel === "strict") {
        return new Promise(
            (_, reject) => ElMessageBox({
                appendTo,
                boxType: 'alert',
                type: 'warning',
                title: '',
                message: <div>{t(msg => msg.limit.verification.strictTip)}</div>,
            }).then(reject).catch(reject)
        )
    }
    let answerValue: string
    let messageNode: VNode | string | Element
    let incorrectMessage: string
    if (limitLevel === 'password' && limitPassword) {
        answerValue = limitPassword
        messageNode = t(msg => msg.limit.verification.pswInputTip)
        incorrectMessage = t(msg => msg.limit.verification.incorrectPsw)
    } else if (limitLevel === 'verification') {
        const pair: VerificationPair = verificationProcessor.generate(limitVerifyDifficulty, locale)
        const { prompt, promptParam, answer } = pair || {}
        answerValue = typeof answer === 'function' ? t(msg => answer(msg.limit.verification)) : answer
        incorrectMessage = t(msg => msg.limit.verification.incorrectAnswer)
        if (prompt) {
            const promptTxt = typeof prompt === 'function'
                ? t(msg => prompt(msg.limit.verification), { ...promptParam, answer: answerValue })
                : prompt
            messageNode = (
                <I18nNode
                    path={msg => msg.limit.verification.inputTip}
                    param={{ prompt: <b>{promptTxt}</b> }}
                />
            )
        } else {
            messageNode = (
                <I18nNode
                    path={msg => msg.limit.verification.inputTip2}
                    param={{ answer: <AnswerCanvas text={answerValue} /> }}
                />
            )
        }
    }
    if (!messageNode || !answerValue) return null

    return new Promise(resolve => {
        ElMessageBox({
            appendTo,
            boxType: 'prompt',
            type: 'warning',
            title: '',
            message: <div style={{ userSelect: 'none' }}>{messageNode}</div>,
            showInput: true,
            showCancelButton: true,
            showClose: false,
        }).then(data => {
            const { value } = data
            if (value === answerValue) return resolve()
            ElMessage.error({ appendTo, message: incorrectMessage })
        }).catch(() => { })
    })
}

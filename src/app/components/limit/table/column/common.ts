import { t, tN } from "@app/locale"
import { locale } from "@i18n"
import { VerificationPair } from "@service/limit-service/verification/common"
import verificationProcessor from "@service/limit-service/verification/processor"
import { ElMessageBox, ElMessage } from "element-plus"
import { h, VNode } from "vue"

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
            messageNodes = tN(msg => msg.limit.verification.inputTip2, { answer: h('b', answerValue) })
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

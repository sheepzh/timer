import { computed, defineComponent } from "vue"
import { useDelayHandler, useReason, useRule } from "../context"
import { LimitType } from "@cs/limit/common"
import { ElButton } from "element-plus"
import { t } from "@cs/locale"
import { judgeVerificationRequired, processVerification } from "@app/util/limit"
import optionService from "@service/option-service"
import Trend from "@app/Layout/icons/Trend"
import { Plus, Timer } from "@element-plus/icons-vue"
import { sendMsg2Runtime } from "@api/chrome/runtime"
import { TAG_NAME } from "@cs/limit/element"

const DELAY_ENABLED: LimitType[] = ['DAILY', 'VISIT', 'WEEKLY']

async function handleMore5Minutes(rule: timer.limit.Item, callback: () => void) {
    let promise: Promise<void> = undefined
    const ele = document.querySelector(TAG_NAME).shadowRoot.querySelector('body')
    if (await judgeVerificationRequired(rule)) {
        const option = (await optionService.getAllOption()) as timer.option.DailyLimitOption
        promise = processVerification(option, { appendTo: ele })
        promise ? promise.then(callback).catch(() => { }) : callback()
    } else {
        callback()
    }
}

const _default = defineComponent(() => {
    const reason = useReason()
    const rule = useRule()
    const allowDelay = computed(() => {
        const { type, allowDelay } = reason.value || {}
        return DELAY_ENABLED.includes(type) && allowDelay
    })

    const delayHandler = useDelayHandler()

    return () => (
        <div class='footer-container'>
            <ElButton
                round
                icon={<Trend />}
                type="success"
                onClick={() => sendMsg2Runtime('cs.openAnalysis')}
            >
                {t(msg => msg.menu.siteAnalysis)}
            </ElButton>
            <ElButton
                v-show={allowDelay.value}
                type="primary"
                round
                icon={<Plus />}
                onClick={() => handleMore5Minutes(rule.value, delayHandler)}
            >
                {t(msg => msg.modal.more5Minutes)}
            </ElButton>
            <ElButton
                round
                icon={<Timer />}
                onClick={() => sendMsg2Runtime('cs.openLimit')}
            >
                {t(msg => msg.modal.ruleDetail)}
            </ElButton>
        </div>
    )
})

export default _default
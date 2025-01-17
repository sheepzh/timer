import { useRequest } from "@hooks/useRequest"
import { useWindowVisible } from "@hooks/useWindowVisible"
import limitService from "@service/limit-service"
import { type App, inject, provide, type Ref, ref, watch } from "vue"
import { type LimitReason } from "../common"

const REASON_KEY = "display_reason"
const RULE_KEY = "display_rule"
const DELAY_HANDLER_KEY = 'delay_handler'

export const provideReason = (app: App<Element>) => {
    const reason = ref<LimitReason>()
    app?.provide(REASON_KEY, reason)
    return reason
}

export const useReason = (): Ref<LimitReason> => inject(REASON_KEY)

export const provideRule = () => {
    const reason = useReason()
    const windowVisible = useWindowVisible()

    const { data: rule, refresh } = useRequest(async () => {
        if (!windowVisible.value) return null
        const reasonId = reason.value?.id
        if (!reasonId) return null
        const rules = await limitService.select({ id: reasonId, filterDisabled: false })
        return rules?.[0]
    })

    watch([reason, windowVisible], refresh)

    provide(RULE_KEY, rule)
}

export const useRule = (): Ref<timer.limit.Item> => inject(RULE_KEY)

export const provideDelayHandler = (app: App<Element>, handlers: () => void) => {
    app?.provide(DELAY_HANDLER_KEY, handlers)
}

export const useDelayHandler = (): () => void => inject(DELAY_HANDLER_KEY)
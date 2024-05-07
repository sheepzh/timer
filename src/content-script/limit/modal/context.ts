import { App, inject, provide, Ref, ref } from "vue"
import { LimitReason } from "../common"

const REASON_KEY = "display_reason"
const RULE_KEY = "display_rule"
const DELAY_HANDLER_KEY = 'delay_handler'

export const provideReason = (app: App<Element>) => {
    const reason = ref<LimitReason>()
    app?.provide(REASON_KEY, reason)
    return reason
}

export const useReason = (): Ref<LimitReason> => inject(REASON_KEY)

export const provideRule = (rule: Ref<timer.limit.Item>) => provide(RULE_KEY, rule)

export const useRule = (): Ref<timer.limit.Item> => inject(RULE_KEY)

export const provideDelayHandler = (app: App<Element>, handlers: () => void) => {
    app?.provide(DELAY_HANDLER_KEY, handlers)
}

export const useDelayHandler = (): () => void => inject(DELAY_HANDLER_KEY)
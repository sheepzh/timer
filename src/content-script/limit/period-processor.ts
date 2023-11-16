import { sendMsg2Runtime } from "@api/chrome/runtime"
import { LimitReason, ModalContext, Processor } from "./common"
import { date2Idx } from "@util/limit"

class PeriodProcessor implements Processor {
    private context: ModalContext
    private timers: NodeJS.Timer[] = []

    constructor(context: ModalContext) {
        this.context = context
    }

    async handleMsg(code: timer.mq.ReqCode): Promise<timer.mq.Response> {
        if (code === "limitPeriodChange") {
            this.timers?.forEach(clearInterval)
            await this.init()
            return { code: "success" }
        }
        return { code: "ignore" }
    }

    async init(): Promise<void> {
        const rules: timer.limit.Item[] = await sendMsg2Runtime("cs.getRelatedRules", this.context.url)
        // Clear first
        this.context.modal.removeReasonsByType("PERIOD")
        this.timers = this.calcInterval(rules, this.context)
    }

    private calcInterval(rules: timer.limit.Rule[], context: ModalContext): NodeJS.Timer[] {
        const nowSeconds = date2Idx(new Date())
        const timers = []
        rules?.forEach?.(rule => {
            const { cond, periods } = rule
            periods?.forEach(p => {
                const [s, e] = p
                const startSeconds = s * 60
                const endSeconds = (e + 1) * 60
                const reason: LimitReason = { cond, type: "PERIOD" }
                if (nowSeconds < startSeconds) {
                    timers.push(setInterval(() => context.modal.addReason(reason), (startSeconds - nowSeconds) * 1000))
                    timers.push(setInterval(() => context.modal.removeReason(reason), (endSeconds - nowSeconds) * 1000))
                } else if (nowSeconds >= startSeconds && nowSeconds <= endSeconds) {
                    context.modal.addReason(reason)
                    timers.push(setInterval(() => context.modal.removeReason(reason), (endSeconds - nowSeconds) * 1000))
                }
            })
        })
        return undefined
    }
}

export default PeriodProcessor
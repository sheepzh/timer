import { sendMsg2Runtime } from "@api/chrome/runtime"
import { LimitReason, ModalContext, Processor } from "../common"
import { date2Idx } from "@util/limit"

class PeriodProcessor implements Processor {
    private context: ModalContext
    private timers: number[] = []

    constructor(context: ModalContext) {
        this.context = context
    }

    async handleMsg(code: timer.mq.ReqCode, data: timer.limit.Item[]): Promise<timer.mq.Response> {
        if (code === "limitChanged") {
            this.timers?.forEach(clearInterval)
            await this.init0(data)
            return { code: "success" }
        }
        return { code: "ignore" }
    }

    init(): Promise<void> {
        return this.init0()
    }

    private async init0(rules?: timer.limit.Item[]) {
        rules = rules || await sendMsg2Runtime("cs.getRelatedRules", this.context.url)
        // Clear first
        this.context.modal.removeReasonsByType("PERIOD")
        this.timers = this.calcInterval(rules, this.context)
    }

    private calcInterval(rules: timer.limit.Rule[], context: ModalContext): number[] {
        const nowSeconds = date2Idx(new Date())
        const timers = []
        rules?.forEach?.(rule => {
            const { cond, periods, id } = rule
            periods?.forEach(p => {
                const [s, e] = p
                const startSeconds = s * 60
                const endSeconds = (e + 1) * 60
                const reason: LimitReason = { id, cond, type: "PERIOD" }
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
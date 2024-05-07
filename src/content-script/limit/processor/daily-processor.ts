import { matches } from "@util/limit"
import { LimitReason, ModalContext, Processor } from "../common"
import { sendMsg2Runtime } from "@api/chrome/runtime"

class DailyProcessor implements Processor {
    private context: ModalContext

    constructor(context: ModalContext) {
        this.context = context
    }

    handleMsg(code: timer.mq.ReqCode, data: unknown): timer.mq.Response | Promise<timer.mq.Response> {
        let items = data as timer.limit.Item[]
        if (code === "limitTimeMeet") {
            if (!items?.length) {
                return { code: "fail" }
            }
            items.filter(item => matches(item, this.context.url))
                .forEach(({ cond, allowDelay, id }) => {
                    const reason: LimitReason = { type: "DAILY", cond, allowDelay, id }
                    this.context.modal.addReason(reason)
                })
            return { code: "success" }
        } else if (code === "limitChanged") {
            this.context.modal.removeReasonsByType("DAILY")
            items?.forEach(({ cond, allowDelay, id }) => {
                const reason: LimitReason = { type: "DAILY", cond, allowDelay, id }
                this.context.modal.addReason(reason)
            })
            return { code: "success" }
        } else if (code === "limitWaking") {
            items?.forEach(({ cond, allowDelay, id }) => {
                const reason: LimitReason = { type: "DAILY", cond, allowDelay, id }
                this.context.modal.removeReason(reason)
            })
            return { code: "success" }
        }
        return { code: "ignore" }
    }

    async init(): Promise<void> {
        const limitedRules: timer.limit.Item[] = await sendMsg2Runtime('cs.getLimitedRules', this.context.url)
        if (!limitedRules?.length) return

        limitedRules?.forEach(({ cond, allowDelay, id }) => {
            const reason: LimitReason = { type: "DAILY", cond, allowDelay, id }
            this.context.modal.addReason(reason)
        })
    }
}

export default DailyProcessor
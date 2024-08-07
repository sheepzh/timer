import { hasLimited, matches } from "@util/limit"
import { LimitReason, ModalContext, Processor } from "../common"
import { sendMsg2Runtime } from "@api/chrome/runtime"

const cvtItem2Reason = (item: timer.limit.Item): LimitReason => {
    const { cond, allowDelay, id, delayCount } = item
    return { type: "DAILY", cond, allowDelay, id, delayCount }
}

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
                .map(cvtItem2Reason)
                .forEach(reason => this.context.modal.addReason(reason))
            return { code: "success" }
        } else if (code === "limitChanged") {
            this.context.modal.removeReasonsByType("DAILY")
            items?.filter?.(i => hasLimited(i))
                ?.map(cvtItem2Reason)
                ?.forEach(reason => this.context.modal.addReason(reason))
            return { code: "success" }
        } else if (code === "limitWaking") {
            items?.map(cvtItem2Reason)
                ?.forEach(reason => this.context.modal.removeReason(reason))
            return { code: "success" }
        }
        return { code: "ignore" }
    }

    async init(): Promise<void> {
        this.initRules?.()
        this.context.modal?.addDelayHandler(() => this.initRules())
    }

    async initRules(): Promise<void> {
        this.context.modal?.removeReasonsByType?.('DAILY')
        const limitedRules: timer.limit.Item[] = await sendMsg2Runtime('cs.getLimitedRules', this.context.url)

        limitedRules?.forEach(({ cond, allowDelay, id, delayCount }) => {
            const reason: LimitReason = { type: "DAILY", cond, allowDelay, id, delayCount }
            this.context.modal.addReason(reason)
        })
    }
}

export default DailyProcessor
import TrackerClient from "@src/background/timer/client"
import { ModalContext, Processor } from "../common"
import { sendMsg2Runtime } from "@api/chrome/runtime"

class VisitProcessor implements Processor {

    private context: ModalContext
    private focusTime: number = 0
    private rules: timer.limit.Rule[]
    private tracker: TrackerClient

    constructor(context: ModalContext) {
        this.context = context
    }

    async handleMsg(code: timer.mq.ReqCode, _data: any): Promise<timer.mq.Response> {
        if (code === "limitChanged") {
            this.initRules()
            return { code: "success" }
        } else if (code === "askVisitTime") {
            return { code: "success", data: this.focusTime }
        }
        return { code: "ignore" }
    }

    async handleTracker(data: timer.stat.Event) {
        const diff = (data?.end ?? 0) - (data?.start ?? 0)
        this.focusTime += diff
        this.rules?.forEach?.(({ id, visitTime, cond, allowDelay }) => {
            if (!visitTime) return
            if (visitTime * 1000 < this.focusTime) {
                this.context.modal.addReason({
                    id,
                    cond,
                    type: "VISIT",
                    allowDelay,
                    getVisitTime: () => this.focusTime,
                })
            }
        })
    }

    async initRules() {
        this.rules = await sendMsg2Runtime("cs.getRelatedRules", this.context.url)
        this.context.modal.removeReasonsByType("VISIT")
    }

    async init(): Promise<void> {
        this.tracker = new TrackerClient(data => this.handleTracker(data))
        this.tracker.init()
        this.initRules()
        this.context.modal.addDelayHandler(() => this.processMore5Minutes())
    }

    private processMore5Minutes() {
        this.focusTime = Math.max(0, this.focusTime - 5 * 60 * 1000)
        this.context.modal.removeReasonsByType("VISIT")
    }
}

export default VisitProcessor
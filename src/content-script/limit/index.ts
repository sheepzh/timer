import { MaskModal, ModalContext, Processor } from "./common"
import ModalInstance from "./modal"
import MessageAdaptor from "./processor/message-adaptor"
import VisitProcessor from "./processor/visit-processor"
import PeriodProcessor from "./processor/period-processor"
import { onRuntimeMessage } from "@api/chrome/runtime"
import { allMatch } from "@util/array"

export default async function processLimit(url: string) {
    const modal: MaskModal = new ModalInstance(url)
    const context: ModalContext = { modal, url }

    const processors: Processor[] = [
        new MessageAdaptor(context),
        new PeriodProcessor(context),
        new VisitProcessor(context),
    ]

    await Promise.all(processors.map(p => p.init()))

    onRuntimeMessage<unknown, any>(async msg => {
        const results = await Promise.all(processors.map(async p => {
            const { code, data } = msg || {}
            return await p.handleMsg(code, data)
        }))

        const allIgnore = allMatch(results, r => r.code === "ignore")
        if (allIgnore) return { code: "ignore" }

        const anyFail = allMatch(results, r => r.code === "fail")
        if (anyFail) return { code: "fail" }
        // Merge data of all the handlers
        const items = results
            .filter(r => r.code === "success")
            .map(r => r.data)
            .filter(r => r !== undefined && r !== null)
        const data = items.length <= 1 ? items[0] : items
        return { code: "success", data }
    })
}

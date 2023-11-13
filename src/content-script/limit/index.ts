import { MaskModal, ModalContext, Processor } from "./common"
import ModalInstance from "./modal"
import DailyProcessor from "./daily-processor"
import VisitProcessor from "./visit-processor"
import PeriodProcessor from "./period-processor"
import { onRuntimeMessage } from "@api/chrome/runtime"
import { allMatch } from "@util/array"

export default async function processLimit(url: string) {
    const modal: MaskModal = new ModalInstance(url)
    const context: ModalContext = { modal, url }

    const processors: Processor[] = [
        new DailyProcessor(context),
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
        const datas = results
            .filter(r => r.code === "success")
            .map(r => r.data)
            .filter(r => r !== undefined && r !== null)
        const data = datas.length <= 1 ? datas[0] : datas
        console.log("sdadsa", data)
        return { code: "success", data }
    })
}

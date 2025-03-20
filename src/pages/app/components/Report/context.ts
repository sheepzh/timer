import { useProvide, useProvider } from "@hooks"
import { type Ref } from "vue"
import type { ReportFilterOption } from "./types"

type Context = {
    filter: Ref<ReportFilterOption>
}

const NAMESPACE = 'report'

export const initProvider = (
    filter: Ref<ReportFilterOption>,
) => useProvide<Context>(NAMESPACE, {
    filter
})

export const useReportFilter = (): Ref<ReportFilterOption> => useProvider<Context, 'filter'>(NAMESPACE, "filter").filter
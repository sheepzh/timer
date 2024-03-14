import { useProvide, useProvider } from "@app/hooks/useProvider"
import { Ref } from "vue"

type Context = {
    filter: Ref<ReportFilterOption>
}

const NAMESPACE = 'report'

export const initProvider = (
    filter: Ref<ReportFilterOption>,
) => useProvide<Context>(NAMESPACE, {
    filter
})

export const useReportFilter = (): Ref<ReportFilterOption> => useProvider<Context>(NAMESPACE, "filter").filter

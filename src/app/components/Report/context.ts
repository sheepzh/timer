import { provideWithNs, useProviderWithNs } from "@app/util/provider"
import { Ref } from "vue"

type Context = {
    filter: Ref<ReportFilterOption>
}

const NAMESPACE = 'report'

export const initProvider = (
    filter: Ref<ReportFilterOption>,
) => provideWithNs<Context>(NAMESPACE, {
    filter
})

export const useReportFilter = (): Ref<ReportFilterOption> => useProviderWithNs<Context>(NAMESPACE, "filter").filter

import { useProvide, useProvider } from "@hooks"
import { Ref } from "vue"

export type ReportFilterOption = {
    host: string
    dateRange: [Date, Date]
    mergeDate: boolean
    mergeHost: boolean
    /**
     * @since 1.1.7
     */
    timeFormat: timer.app.TimeFormat
    readRemote?: boolean
}

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

export interface DisplayComponent {
    getSelected(): timer.stat.Row[]
    refresh(): Promise<void> | void
}
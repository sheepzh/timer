/**
 * Copyright (c) 2024 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { useProvide, useProvider } from "@hooks/useProvider"
import { Ref } from "vue"

type Context = {
    dateRange: Ref<[Date, Date]>
    rangeLength: Ref<number>
}

const NAMESPACE = 'siteAnalysis_trend'

export const initProvider = (
    dateRange: Ref<[Date, Date]>,
    rangeLength: Ref<number>,
) => useProvide<Context>(NAMESPACE, {
    dateRange, rangeLength
})

export const useAnalysisTrendDateRange = (): Ref<[Date, Date]> => useProvider<Context>(NAMESPACE, "dateRange").dateRange

export const useAnalysisTrendRangeLength = (): Ref<number> => useProvider<Context>(NAMESPACE, "rangeLength").rangeLength
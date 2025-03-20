/**
 * Copyright (c) 2024 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { useProvide, useProvider } from "@hooks"
import { type Ref } from "vue"

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

export const useAnalysisTrendDateRange = () => useProvider<Context, 'dateRange'>(NAMESPACE, "dateRange").dateRange

export const useAnalysisTrendRangeLength = () => useProvider<Context, 'rangeLength'>(NAMESPACE, "rangeLength").rangeLength
/**
 * Copyright (c) 2024 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { provideWithNs, useProviderWithNs } from "@app/util/provider"
import { Ref } from "vue"

type Context = {
    dateRange: Ref<[Date, Date]>
    rangeLength: Ref<number>
}

const NAMESPACE = 'siteAnalysis_trend'

export const initProvider = (
    dateRange: Ref<[Date, Date]>,
    rangeLength: Ref<number>
) => provideWithNs<Context>(NAMESPACE, {
    dateRange, rangeLength
})

export const useAnalysisTrendDateRange = (): Ref<[Date, Date]> => useProviderWithNs<Context>(NAMESPACE, "dateRange").dateRange

export const useAnalysisTrendRangeLength = (): Ref<number> => useProviderWithNs<Context>(NAMESPACE, "rangeLength").rangeLength
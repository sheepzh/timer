/**
 * Copyright (c) 2024 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { provideWithNs, useProviderWithNs } from "@app/util/provider"
import { Ref } from "vue"
import { FilterOption } from "./filter"

type Context = {
    keyRange: Ref<timer.period.KeyRange>
    rows: Ref<timer.period.Row[]>
    filter: Ref<FilterOption>
}

const NAMESPACE = 'habitPeriod'

export const initProvider = (
    keyRange: Ref<timer.period.KeyRange>,
    rows: Ref<timer.period.Row[]>,
    filter: Ref<FilterOption>,
) => provideWithNs<Context>(NAMESPACE, {
    keyRange, rows, filter
})

export const usePeriodRange = (): Ref<timer.period.KeyRange> => useProviderWithNs<Context>(NAMESPACE, "keyRange").keyRange

export const usePeriodRows = (): Ref<timer.period.Row[]> => useProviderWithNs<Context>(NAMESPACE, "rows").rows

export const usePeriodFilter = (): Ref<FilterOption> => useProviderWithNs<Context>(NAMESPACE, "filter").filter

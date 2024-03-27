/**
 * Copyright (c) 2024 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { useProvide, useProvider } from "@hooks/useProvider"
import { Ref } from "vue"
import { FilterOption } from "./Filter"

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
) => useProvide<Context>(NAMESPACE, {
    keyRange, rows, filter
})

export const usePeriodRange = (): Ref<timer.period.KeyRange> => useProvider<Context>(NAMESPACE, "keyRange").keyRange

export const usePeriodRows = (): Ref<timer.period.Row[]> => useProvider<Context>(NAMESPACE, "rows").rows

export const usePeriodFilter = (): Ref<FilterOption> => useProvider<Context>(NAMESPACE, "filter").filter

/**
 * Copyright (c) 2024 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { useProvide, useProvider } from "@hooks"
import { mergeDate } from "@service/stat-service/merge/date"
import { computed, type Ref } from "vue"

type Context = {
    rows: Ref<timer.stat.Row[]>
    dateMergedRows: Ref<timer.stat.Row[]>
}

const NAMESPACE = 'habitSite'

export const initProvider = (rows: Ref<timer.stat.Row[]>) => {
    const dateMergedRows = computed(() => mergeDate(rows.value ?? []))
    useProvide<Context>(NAMESPACE, { rows, dateMergedRows })
}

export const useRows = (): Ref<timer.stat.Row[]> => useProvider<Context, 'rows'>(NAMESPACE, "rows").rows

export const useDateMergedRows = (): Ref<timer.stat.Row[]> => useProvider<Context, 'dateMergedRows'>(NAMESPACE, 'dateMergedRows').dateMergedRows
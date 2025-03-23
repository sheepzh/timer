/**
 * Copyright (c) 2024 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { useProvide, useProvider } from "@hooks"
import { type Ref } from "vue"
import { AnalysisTarget } from "./types"

type Context = {
    target: Ref<AnalysisTarget | undefined>
    timeFormat: Ref<timer.app.TimeFormat>
    rows: Ref<timer.stat.Row[]>
}

const NAMESPACE = 'siteAnalysis'

export const initProvider = (
    target: Ref<AnalysisTarget | undefined>,
    timeFormat: Ref<timer.app.TimeFormat>,
    rows: Ref<timer.stat.Row[]>,
) => useProvide<Context>(NAMESPACE, {
    target, timeFormat, rows
})

export const useAnalysisTarget = () => useProvider<Context, 'target'>(NAMESPACE, "target").target

export const useAnalysisTimeFormat = () => useProvider<Context, 'timeFormat'>(NAMESPACE, "timeFormat").timeFormat

export const useAnalysisRows = () => useProvider<Context, 'rows'>(NAMESPACE, "rows").rows
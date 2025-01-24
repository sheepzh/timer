/**
 * Copyright (c) 2024 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { useProvide, useProvider } from "@hooks"
import { watch, type Ref } from "vue"
import { AnalysisTarget } from "./types"

type Context = {
    target: Ref<AnalysisTarget>
    timeFormat: Ref<timer.app.TimeFormat>
    rows: Ref<timer.stat.Row[]>
}

const NAMESPACE = 'siteAnalysis'

export const initProvider = (
    target: Ref<AnalysisTarget>,
    timeFormat: Ref<timer.app.TimeFormat>,
    rows: Ref<timer.stat.Row[]>,
) => useProvide<Context>(NAMESPACE, {
    target, timeFormat, rows
})

export const useAnalysisTarget = (): Ref<AnalysisTarget> => useProvider<Context>(NAMESPACE, "target").target

export const useAnalysisTimeFormat = (): Ref<timer.app.TimeFormat> => useProvider<Context>(NAMESPACE, "timeFormat").timeFormat

export const useAnalysisRows = (): Ref<timer.stat.Row[]> => useProvider<Context>(NAMESPACE, "rows").rows
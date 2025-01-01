/**
 * Copyright (c) 2024 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { useProvide, useProvider } from "@hooks"
import { type Ref } from "vue"

type Context = {
    site: Ref<timer.site.SiteKey>
    timeFormat: Ref<timer.app.TimeFormat>
    rows: Ref<timer.stat.Row[]>
}

const NAMESPACE = 'siteAnalysis'

export const initProvider = (
    site: Ref<timer.site.SiteKey>,
    timeFormat: Ref<timer.app.TimeFormat>,
    rows: Ref<timer.stat.Row[]>,
) => useProvide<Context>(NAMESPACE, {
    site, timeFormat, rows
})

export const useAnalysisSite = (): Ref<timer.site.SiteKey> => useProvider<Context>(NAMESPACE, "site").site

export const useAnalysisTimeFormat = (): Ref<timer.app.TimeFormat> => useProvider<Context>(NAMESPACE, "timeFormat").timeFormat

export const useAnalysisRows = (): Ref<timer.stat.Row[]> => useProvider<Context>(NAMESPACE, "rows").rows
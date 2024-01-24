/**
 * Copyright (c) 2024 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { provideWithNs, useProviderWithNs } from "@app/util/provider"
import { Ref } from "vue"

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
) => provideWithNs<Context>(NAMESPACE, {
    site, timeFormat, rows
})

export const useAnalysisSite = (): Ref<timer.site.SiteKey> => useProviderWithNs<Context>(NAMESPACE, "site").site

export const useAnalysisTimeFormat = (): Ref<timer.app.TimeFormat> => useProviderWithNs<Context>(NAMESPACE, "timeFormat").timeFormat

export const useAnalysisRows = (): Ref<timer.stat.Row[]> => useProviderWithNs<Context>(NAMESPACE, "rows").rows
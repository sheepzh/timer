/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import siteService from "@service/site-service"
import { computedAsync } from "@vueuse/core"
import { defineComponent } from "vue"
import { useAnalysisSite } from "../../context"
import { labelOfHostInfo } from "../../util"

function renderChildren(site: timer.site.SiteInfo) {
    if (!site) return <h1 class="alias">{t(msg => msg.analysis.common.emptyDesc)}</h1>

    const { iconUrl, alias } = site
    const label = labelOfHostInfo(site)
    const title: string = alias ? alias : label
    const subtitle: string = alias ? label : undefined
    return <>
        {iconUrl && <img src={iconUrl} width={24} height={24} />}
        <h1 class="alias">{title}</h1>
        {subtitle && <p class="host">{subtitle}</p>}
    </>
}

const computedSiteInfo = async (siteKey: timer.site.SiteKey): Promise<timer.site.SiteInfo> => {
    if (!siteKey) return undefined
    return await siteService.get(siteKey)
}

const _default = defineComponent(() => {
    const site = useAnalysisSite()
    const siteInfo = computedAsync(() => computedSiteInfo(site.value))
    return () => (
        <div class="site-container">
            <div class="site-info">
                {renderChildren(siteInfo.value)}
            </div>
        </div>
    )
})

export default _default

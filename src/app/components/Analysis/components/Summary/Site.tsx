/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Ref, defineComponent } from "vue"
import { computedAsync } from "@vueuse/core"
import { labelOfHostInfo } from "../../util"
import { t } from "@app/locale"
import { useAnalysisSite } from "../../context"
import siteService from "@service/site-service"

function renderChildren(site: timer.site.SiteInfo) {
    if (!site) return <h1 class="site-alias">{t(msg => msg.analysis.common.emptyDesc)}</h1>

    const { iconUrl, alias } = site
    const label = labelOfHostInfo(site)
    const title: string = alias ? alias : label
    const subtitle: string = alias ? label : undefined
    return <>
        {iconUrl && <img src={iconUrl} width={24} height={24} />}
        <h1 class="site-alias">{title}</h1>
        {subtitle && <p class="site-host">{subtitle}</p>}
    </>
}

const computedSiteInfo = async (siteKey: timer.site.SiteKey): Promise<timer.site.SiteInfo> => {
    if (!siteKey) return undefined
    return await siteService.get(siteKey)
}

const _default = defineComponent(() => {
    const site = useAnalysisSite()
    const siteInfo: Ref<timer.site.SiteInfo> = computedAsync(() => computedSiteInfo(site.value))
    return () => (
        <div class="site-container">
            {renderChildren(siteInfo.value)}
        </div>
    )
})

export default _default

/**
 * Copyright (c) 2023 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { PropType, defineComponent, h } from "vue"
import { labelOfHostInfo } from "../../util"
import { t } from "@app/locale"

const renderIcon = (iconUrl: string) => h('img', { src: iconUrl, width: 24, height: 24 })
const renderTitle = (title: string) => h('h1', { class: 'site-alias' }, title)
const renderSubtitle = (subtitle: string) => h('p', { class: 'site-host' }, subtitle)

const EMPTY_DESC = t(msg => msg.analysis.common.emptyDesc)

function renderChildren(site: timer.site.SiteInfo) {
    if (!site) {
        return renderTitle(EMPTY_DESC)
    }
    const result = []

    const { iconUrl, alias } = site
    const label = labelOfHostInfo(site)
    const title: string = alias ? alias : label
    const subtitle: string = alias ? label : undefined

    iconUrl && result.push(renderIcon(iconUrl))
    result.push(renderTitle(title))
    subtitle && result.push(renderSubtitle(subtitle))
    return result
}

const _default = defineComponent({
    props: {
        site: Object as PropType<timer.site.SiteInfo>,
    },
    setup(props) {
        return () => h('div', { class: 'site-container' }, renderChildren(props.site))
    }
})

export default _default
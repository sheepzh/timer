/**
 * Copyright (c) 2023-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { createTabAfterCurrent } from "@api/chrome/tab"
import { ArrowDown, Download } from "@element-plus/icons-vue"
import { t } from "@guide/locale"
import { IS_CHROME, IS_EDGE, IS_FIREFOX } from "@util/constant/environment"
import { CHROME_HOMEPAGE, EDGE_HOMEPAGE, FIREFOX_HOMEPAGE } from "@util/constant/url"
import { ElButton, ElDropdown, ElDropdownItem, ElDropdownMenu, ElIcon } from "element-plus"
import { defineComponent, h } from "vue"

type _Info = {
    name: string
    url: string
}

function allInfo(): _Info[] {
    const result: _Info[] = []
    !IS_CHROME && result.push({ name: 'Chrome', url: CHROME_HOMEPAGE })
    !IS_EDGE && result.push({ name: 'Edge', url: EDGE_HOMEPAGE })
    !IS_FIREFOX && result.push({ name: 'Firefox', url: FIREFOX_HOMEPAGE })
    return result
}

function openUrl(url: string) {
    if (!url) return
    createTabAfterCurrent(url)
}

function i18nOfBtn(name: string) {
    return t(msg => msg.home.download, { browser: name })
}

const _default = defineComponent(() => {
    const infos = allInfo()
    const firstInfo = infos[0]
    const dropdownInfos = infos.slice(1)
    return () => h('div', { class: 'download-container' }, [
        firstInfo && h(ElButton, { icon: Download, onClick: () => openUrl(firstInfo.url) }, () => i18nOfBtn(firstInfo.name)),
        dropdownInfos?.length && h(ElDropdown, {
            onCommand: openUrl,
            trigger: 'hover'
        }, {
            default: () => h(ElIcon, {}, () => h(ArrowDown)),
            dropdown: () => h(ElDropdownMenu, {}, () => dropdownInfos
                .map(info => h(ElDropdownItem, { command: info.url }, () => i18nOfBtn(info.name)))
            )
        })
    ])
})

export default _default
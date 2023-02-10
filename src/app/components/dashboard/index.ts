/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { defineComponent, h } from "vue"
import ContentContainer from "@app/components/common/content-container"
import DashboardRow1 from './row1'
import DashboardRow2 from './row2'
import DashboardRow3 from './row3'
import "./style"
import { isTranslatingLocale, locale } from "@i18n"

const _default = defineComponent({
    name: 'Dashboard',
    render: () => h(ContentContainer, {}, () => {
        const nodes = [
            h(DashboardRow1),
            h(DashboardRow2),
        ]
        // Only shows for translating languages' speakers in English
        locale === 'en' && isTranslatingLocale() && nodes.push(h(DashboardRow3))
        return nodes
    })
})

export default _default
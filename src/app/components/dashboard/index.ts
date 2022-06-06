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
import DashboardFeedback from "./feedback"
import "./style/index"
import { locale } from "@util/i18n"

const _default = defineComponent({
    name: 'Dashboard',
    setup() {
        return () => h(ContentContainer, {}, () => {
            const items = [
                h(DashboardRow1),
                h(DashboardRow2)
            ]
            locale === "zh_CN" && (items.push(h(DashboardFeedback)))
            return items
        })
    }
})

export default _default
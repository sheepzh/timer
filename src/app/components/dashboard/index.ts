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
import "./style/index"

const _default = defineComponent({
    name: 'Dashboard',
    setup() {
        return () => h(ContentContainer, {}, () => [
            h(DashboardRow1),
            h(DashboardRow2)
        ])
    }
})

export default _default
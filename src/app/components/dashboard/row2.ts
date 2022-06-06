/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElRow } from "element-plus"
import { defineComponent, h } from "vue"
import DashboardCard from './card'
import CalendarHeatMap from './components/calendar-heat-map'


const _default = defineComponent({
    name: "DashboardRow1",
    render() {
        return h(ElRow, {
            gutter: 40,
            style: { height: '280px' }
        }, () => [
            h(DashboardCard, {
                span: 24
            }, () => h(CalendarHeatMap))
        ])
    }
})

export default _default
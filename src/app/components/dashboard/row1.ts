/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElRow } from "element-plus"
import { defineComponent, h } from "vue"
import DashboardCard from './card'
import Indicator from './components/indicator'
import WeekOnWeek from './components/week-on-week'
import TopKVisit from './components/top-k-visit'

const _default = defineComponent({
    name: "DashboardRow1",
    render() {
        return h(ElRow, {
            gutter: 40,
            style: { height: '290px' }
        }, () => [
            h(DashboardCard, {
                span: 4
            }, () => h(Indicator)),
            h(DashboardCard, {
                span: 12
            }, () => h(WeekOnWeek)),
            h(DashboardCard, {
                span: 8
            }, () => h(TopKVisit)),
        ])
    }
})

export default _default
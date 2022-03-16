/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { h, Ref } from "vue"

export type ChartProps = {
    chartRef: Ref<HTMLDivElement>
}

const _default = (props: ChartProps) => h('div', { class: 'chart-container', ref: props.chartRef })

export default _default
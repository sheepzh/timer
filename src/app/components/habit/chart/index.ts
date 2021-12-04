/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElCard } from 'element-plus'
import { h, Ref } from 'vue'
import { contentContainerCardStyle } from '../../common/content-container'

export type ChartProps = {
    chartRef: Ref<HTMLDivElement>
}

const _default = (props: ChartProps) => h(ElCard,
    contentContainerCardStyle,
    () => h('div', { class: 'chart-container', ref: props.chartRef })
)

export default _default
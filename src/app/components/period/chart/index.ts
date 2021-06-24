import { ElCard } from 'element-plus'
import { h, Ref } from 'vue'

export type ChartProps = {
    chartRef: Ref<HTMLDivElement>
}

const _default = (props: ChartProps) => h(ElCard,
    { class: 'chart-container-card' },
    () => h('div', { class: 'chart-container', ref: props.chartRef })
)

export default _default
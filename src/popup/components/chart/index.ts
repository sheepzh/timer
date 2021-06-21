import { Ref, h } from "vue"

type _Props = {
    chartContainerRef: Ref<HTMLElement>
    width: string
    height: string
}

export type ChartProps = _Props

// pie container
export const pieChartContainer = ({ chartContainerRef, width, height }: _Props) => h('div',
    { ref: chartContainerRef, style: `width:${width}; height:${height};` }
)
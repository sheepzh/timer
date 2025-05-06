import { type GridComponentOption } from "echarts/components"

export const generateGridOption = (): GridComponentOption => {
    return {
        top: 30,
        bottom: 40,
        left: 40,
        right: 20,
    }
}

export type ChartType = 'bar' | 'pie' | 'halfPie'

export type FilterOption = {
    topK: number
    chartType: ChartType
}


import { ECharts, init, use } from "echarts/core"
import { PieChart } from 'echarts/charts'
import { TitleComponent, ToolboxComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

// Register echarts
use([TitleComponent, ToolboxComponent, TooltipComponent, LegendComponent, CanvasRenderer, PieChart])
import { QueryResult } from "../../popup"
import handleClick from "./click-handler"
import { pieOptions } from "./option"

const chartContainer = document.getElementById('chart-container') as HTMLDivElement
const pie: ECharts = init(chartContainer)

// Bound the listener
// Click the item, then forward to the host
pie.on('click', handleClick)

export const handleRestore = (handler: () => void) => {
    // Click the restore button, then query data
    pie.on('restore', handler)
}

function renderChart(queryResult: QueryResult) {
    pie.setOption(pieOptions(queryResult, chartContainer), true, false)
}

export default renderChart
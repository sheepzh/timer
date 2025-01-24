import { BarChart, EffectScatterChart, HeatmapChart, LineChart, PieChart, ScatterChart } from "echarts/charts"
import {
    AriaComponent,
    GridComponent,
    LegendComponent,
    TitleComponent,
    TooltipComponent,
    VisualMapComponent,
} from "echarts/components"
import { use } from "echarts/core"
import { CanvasRenderer } from "echarts/renderers"

export const initEcharts = () => {
    use([
        CanvasRenderer,
        AriaComponent, GridComponent, TooltipComponent, TitleComponent, VisualMapComponent, LegendComponent,
        BarChart, PieChart, LineChart, HeatmapChart, ScatterChart, EffectScatterChart,
    ])
}
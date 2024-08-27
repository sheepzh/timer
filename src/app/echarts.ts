import { BarChart, EffectScatterChart, HeatmapChart, LineChart, PieChart, ScatterChart } from "echarts/charts"
import {
    GridComponent,
    TitleComponent,
    TooltipComponent,
    VisualMapComponent,
    LegendComponent,
} from "echarts/components"
import { use } from "echarts/core"
import { SVGRenderer } from "echarts/renderers"

export const initEcharts = () => {
    use([
        SVGRenderer,
        GridComponent, TooltipComponent, TitleComponent, VisualMapComponent, LegendComponent,
        BarChart, PieChart, LineChart, HeatmapChart, ScatterChart, EffectScatterChart,
    ])
}
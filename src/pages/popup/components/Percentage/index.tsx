import { useRequest } from "@hooks/useRequest"
import { usePopupContext } from "@popup/context"
import { PieChart } from "echarts/charts"
import { LegendComponent, TitleComponent, ToolboxComponent, TooltipComponent } from "echarts/components"
import { use } from "echarts/core"
import { SVGRenderer } from "echarts/renderers"
import { defineComponent } from "vue"
import Cate from "./Cate"
import { doQuery } from "./query"
import Site from "./Site"

use([SVGRenderer, PieChart, LegendComponent, TitleComponent, TooltipComponent, ToolboxComponent])

const Percentage = defineComponent(() => {
    const { query } = usePopupContext()
    const { data } = useRequest(() => doQuery(query.value), { deps: [query] })

    return () => query.value?.mergeMethod === 'cate'
        ? <Cate value={data.value} />
        : <Site value={data.value} />
})

export default Percentage
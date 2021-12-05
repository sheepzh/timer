/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ECharts, init, use } from "echarts/core"
import { PieChart } from "echarts/charts"
import { TitleComponent, ToolboxComponent, TooltipComponent, LegendComponent } from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"

// Register echarts
use([TitleComponent, ToolboxComponent, TooltipComponent, LegendComponent, CanvasRenderer, PieChart])
import { QueryResult } from "../../popup"
import handleClick from "./click-handler"
import { pieOptions } from "./option"
import { defaultStatistics } from "../../../util/constant/option"
import OptionDatabase from "../../../database/option-database"

const optionDatabase = new OptionDatabase(chrome.storage.local)

const chartContainer = document.getElementById('chart-container') as HTMLDivElement
const pie: ECharts = init(chartContainer)

// Initialize
let displaySiteName: boolean = defaultStatistics().collectSiteName
const setDisplaySiteName = (opt: Timer.Option) => displaySiteName = opt.displaySiteName
optionDatabase.getOption().then(setDisplaySiteName)
optionDatabase.addOptionChangeListener(setDisplaySiteName)

// Bound the listener
// Click the item, then forward to the host
pie.on('click', handleClick)

export const handleRestore = (handler: () => void) => {
    // Click the restore button, then query data
    pie.on('restore', handler)
}

function renderChart(queryResult: QueryResult) {
    pie.setOption(pieOptions({ ...queryResult, displaySiteName }, chartContainer), true, false)
}

export default renderChart
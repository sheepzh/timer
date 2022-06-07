/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { ECharts } from "echarts/core"
import type { CallbackDataParams } from "echarts/types/dist/shared"
import type QueryResult from "@popup/common/query-result"

import { init, use } from "@echarts/core"
import PieChart from "@echarts/chart/pie"
import TitleComponent from "@echarts/component/title"
import ToolboxComponent from "@echarts/component/toolbox"
import TooltipComponent from "@echarts/component/tooltip"
import LegendComponent from "@echarts/component/legend"
import CanvasRenderer from "@echarts/canvas-renderer"

// Register echarts
use([TitleComponent, ToolboxComponent, TooltipComponent, LegendComponent, CanvasRenderer, PieChart])

import { defaultStatistics } from "@util/constant/option"
import OptionDatabase from "@db/option-database"
import handleClick from "./click-handler"
import { pieOptions } from "./option"

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
pie.on('click', params => handleClick(params as CallbackDataParams, _queryResult))

export const handleRestore = (handler: () => void) => {
    // Click the restore button, then query data
    pie.on('restore', handler)
}

// Store
let _queryResult: QueryResult

function renderChart(queryResult: QueryResult) {
    _queryResult = queryResult
    pie.setOption(pieOptions({ ...queryResult, displaySiteName }, chartContainer), true, false)
}

export default renderChart
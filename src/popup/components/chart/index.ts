/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { ECharts } from "echarts/core"
import type { CallbackDataParams } from "echarts/types/dist/shared"

import OptionDatabase from "@db/option-database"
import { PopupQueryResult } from "@popup/common"
import { defaultStatistics } from "@util/constant/option"
import { PieChart } from "echarts/charts"
import { LegendComponent, TitleComponent, ToolboxComponent, TooltipComponent } from "echarts/components"
import { init, use } from "echarts/core"
import { SVGRenderer } from "echarts/renderers"
import handleClick from "./click-handler"
import { pieOptions } from "./option"

// Register echarts
use([TitleComponent, ToolboxComponent, TooltipComponent, LegendComponent, SVGRenderer, PieChart])

const optionDatabase = new OptionDatabase(chrome.storage.local)

const chartContainer = document.getElementById('chart-container') as HTMLDivElement
const pie: ECharts = init(chartContainer)

// Initialize
let displaySiteName: boolean = defaultStatistics().collectSiteName
const setDisplaySiteName = (opt: timer.option.AllOption) => displaySiteName = opt.displaySiteName
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
let _queryResult: PopupQueryResult

function renderChart(queryResult: PopupQueryResult) {
    _queryResult = queryResult
    pie.setOption(pieOptions({ ...queryResult, displaySiteName }, chartContainer), true, false)
}

export default renderChart
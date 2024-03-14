/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { ECharts } from "echarts/core"
import type { CallbackDataParams } from "echarts/types/dist/shared"

import { init, use } from "echarts/core"
import { PieChart } from "echarts/charts"
import { TitleComponent, ToolboxComponent, TooltipComponent, LegendComponent } from "echarts/components"
import { SVGRenderer } from "echarts/renderers"

// Register echarts
use([TitleComponent, ToolboxComponent, TooltipComponent, LegendComponent, SVGRenderer, PieChart])

import { defaultStatistics } from "@util/constant/option"
import OptionDatabase from "@db/option-database"
import handleClick from "./click-handler"
import { pieOptions } from "./option"

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
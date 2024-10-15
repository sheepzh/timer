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
import { AriaComponent, LegendComponent, TitleComponent, ToolboxComponent, TooltipComponent } from "echarts/components"
import { init, use } from "echarts/core"
import { CanvasRenderer } from "echarts/renderers"
import handleClick from "./click-handler"
import { pieOptions } from "./option"
import accessibilityHelper from "@service/components/accessibility-helper"
import { processAria, processRtl } from "@util/echarts"

// Register echarts
use([TitleComponent, ToolboxComponent, TooltipComponent, LegendComponent, AriaComponent, CanvasRenderer, PieChart])

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

async function renderChart(queryResult: PopupQueryResult) {
    _queryResult = queryResult
    const option = pieOptions({ ...queryResult, displaySiteName }, chartContainer)

    const { chartDecal } = await accessibilityHelper.getOption() || {}
    processAria(option, chartDecal)
    processRtl(option)

    pie.setOption(option, true, false)
}

export default renderChart
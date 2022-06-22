/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import "./style"

import renderChart, { handleRestore } from "./components/chart"
import initFooter, { queryInfo } from "./components/footer"
import metaService from "@service/meta-service"
import "../common/timer"
import { toggle, init as initTheme } from "@util/dark-mode"
import optionService from "@service/option-service"

// Calculate the latest mode
initTheme()
optionService.isDarkMode().then(toggle)

handleRestore(queryInfo)
initFooter(renderChart)
metaService.increasePopup()
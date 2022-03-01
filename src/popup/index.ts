/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import 'element-plus/theme-chalk/index.css'

// Customized css after element's css
import './style' // global css

import renderChart, { handleRestore } from "./components/chart"
import initFooter, { queryInfo } from "./components/footer"
import metaService from "@service/meta-service"
import "../common/timer"

handleRestore(queryInfo)
initFooter(renderChart)
metaService.increasePopup()
/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { App } from "vue"

import { createApp } from "vue"
import Main from "./Layout"
import 'element-plus/theme-chalk/index.css'
import './styles' // global css
import installRouter from "./router"
import '../common/timer'
import { initLocale } from "@i18n"
import { toggle, init as initTheme } from "@util/dark-mode"
import optionService from "@service/option-service"
import { initElementLocale } from "@i18n/element"
import { initEcharts } from "./echarts"
import { listenMediaSizeChange } from "@hooks/useMediaSize"

async function main() {
    // Init theme with cache first
    initTheme()
    listenMediaSizeChange()
    // Calculate the latest mode
    optionService.isDarkMode().then(toggle)
    await initLocale()
    initEcharts()
    const app: App = createApp(Main)
    installRouter(app)

    const el = document.createElement('div')
    document.body.append(el)
    el.id = 'app'
    app.mount(el)

    await initElementLocale(app)
}

main()
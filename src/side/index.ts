/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { App, createApp } from "vue"
import 'element-plus/theme-chalk/index.css'
import '../common/timer'
import { ElLoadingDirective } from 'element-plus'
import Main from "./Layout"
import { initLocale } from "@i18n"
import { toggle, init as initTheme } from "@util/dark-mode"
import optionService from "@service/option-service"
import "./style.sass"
import { initElementLocale } from "@i18n/element"

async function main() {
    // Init theme with cache first
    initTheme()
    // Calculate the latest mode
    optionService.isDarkMode().then(toggle)
    await initLocale()
    const app: App = createApp(Main)
    app.directive("loading", ElLoadingDirective)
    app.mount('#app')
    await initElementLocale(app)
}

main()
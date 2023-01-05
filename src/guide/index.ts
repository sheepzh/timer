/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import "./style"
import 'element-plus/theme-chalk/index.css'

import { initLocale } from "@i18n"
import { t } from "./locale"
import { init as initTheme, toggle } from "@util/dark-mode"
import { createApp } from "vue"
import Main from "./layout"
import optionService from "@service/option-service"

async function main() {
    initTheme()
    // Calculate the latest mode
    optionService.isDarkMode().then(toggle)
    await initLocale()

    const app = createApp(Main)
    app.mount('#guide')

    document.title = t(msg => msg.base.guidePage) + ' | ' + t(msg => msg.meta.name)
}

main()

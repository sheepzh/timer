/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import "./style"
import 'element-plus/theme-chalk/index.css'

import { initLocale } from "@util/i18n"
import { t } from "./locale"
import { init as initTheme } from "@util/dark-mode"
import { createApp } from "vue"
import Main from "./layout"


async function main() {
    initTheme()
    await initLocale()

    const app = createApp(Main)
    app.mount('#guide')

    document.title = t(msg => msg.layout.title)
}

main()

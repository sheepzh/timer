/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { initLocale } from "@i18n"
import metaService from "@service/meta-service"
import optionService from "@service/option-service"
import { init as initTheme, toggle } from "@util/dark-mode"
import { createApp } from "vue"
import "../common/timer"
import Main from "./Main"
import "./style"

async function main() {
    const el = document.createElement('div')
    el.id = 'app'
    document.body.append(el)
    // Calculate the latest mode
    initTheme()

    await initLocale()
    optionService.isDarkMode().then(toggle)

    const app = createApp(Main)
    app.mount(el)
    document.body.append(el)

    metaService.increasePopup()
}

main()

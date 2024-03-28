/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import "./style"

import renderChart, { handleRestore } from "./components/chart"
import FooterWrapper from "./components/footer"
import metaService from "@service/meta-service"
import "../common/timer"
import { toggle, init as initTheme } from "@util/dark-mode"
import optionService from "@service/option-service"
import { initLocale } from "@i18n"

async function main() {
    await initLocale()
    // Calculate the latest mode
    initTheme()
    optionService.isDarkMode().then(toggle)

    const footer: FooterWrapper = new FooterWrapper(renderChart)
    handleRestore(() => footer.query())
    footer.init()
    metaService.increasePopup()
}

main()

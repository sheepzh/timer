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
import "../common/timer"
import renderChart, { handleRestore } from "./components/chart"
import FooterWrapper from "./components/footer"
import "./style"

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

/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import optionService from "@service/option-service"

function useDarkMode() {
    const el = document.documentElement
    if (!el) {
        return
    }
    const theme = require("./dark-theme.json")
    Object.entries(theme).forEach(([key, val]) => el.style.setProperty(key, val?.toString?.() || ""))
}

export default async function processDarkMode() {
    require('element-plus/theme-chalk/index.css')
    if (await optionService.isDarkMode()) {
        // todo 
        // dark mode
    }
    // global css
    require('../styles')
}
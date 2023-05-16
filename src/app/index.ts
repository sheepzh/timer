/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { App } from "vue"
import type { Language } from "element-plus/lib/locale"

import { createApp } from "vue"
import Main from "./layout"
import 'element-plus/theme-chalk/index.css'
import './styles' // global css
import installRouter from "./router"
import '../common/timer'
import ElementPlus from 'element-plus'
import { initLocale, locale as appLocale } from "@i18n"
import { toggle, init as initTheme } from "@util/dark-mode"
import optionService from "@service/option-service"
import "@src/common/timer"

const locales: { [locale in timer.Locale]: () => Promise<{ default: Language }> } = {
    zh_CN: () => import('element-plus/lib/locale/lang/zh-cn'),
    zh_TW: () => import('element-plus/lib/locale/lang/zh-tw'),
    en: () => import('element-plus/lib/locale/lang/en'),
    ja: () => import('element-plus/lib/locale/lang/ja'),
    pt: () => import('element-plus/lib/locale/lang/pt'),
}

async function main() {
    // Init theme with cache first
    initTheme()
    // Calculate the latest mode
    optionService.isDarkMode().then(toggle)
    await initLocale()
    const app: App = createApp(Main)
    installRouter(app)
    app.mount('#app')

    locales[appLocale]?.()?.then(locale => app.use(ElementPlus, { locale: locale.default }))
}

main()
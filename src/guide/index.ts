/**
 * Copyright (c) 2022-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import type { Language } from "element-plus/lib/locale"

import "./style"
import ElementPlus from 'element-plus'
import { initLocale, locale } from "@i18n"
import { t } from "./locale"
import installRouter from "./router"
import { createApp } from "vue"
import Main from "./layout"
import 'element-plus/theme-chalk/index.css'

const locales: { [locale in timer.Locale]: () => Promise<{ default: Language }> } = {
    zh_CN: () => import('element-plus/lib/locale/lang/zh-cn'),
    zh_TW: () => import('element-plus/lib/locale/lang/zh-tw'),
    en: () => import('element-plus/lib/locale/lang/en'),
    ja: () => import('element-plus/lib/locale/lang/ja'),
    pt: () => import('element-plus/lib/locale/lang/pt'),
}

async function main() {
    await initLocale()
    const app = createApp(Main)
    installRouter(app)

    document.title = t(msg => msg.base.guidePage) + ' | ' + t(msg => msg.meta.name)
    locales[locale]?.()?.then(msg => app.use(ElementPlus, { locale: msg.default }))
    app.mount('#guide')
}

main()

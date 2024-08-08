import type { Language } from "element-plus/lib/locale"
import type { App } from "vue"
import ElementPlus from 'element-plus'
import { FEEDBACK_LOCALE, locale, t } from "."
import calendarMessages from "./message/common/calendar"

const LOCALES: { [locale in timer.Locale]: () => Promise<{ default: Language }> } = {
    zh_CN: () => import('element-plus/lib/locale/lang/zh-cn'),
    zh_TW: () => import('element-plus/lib/locale/lang/zh-tw'),
    en: () => import('element-plus/lib/locale/lang/en'),
    ja: () => import('element-plus/lib/locale/lang/ja'),
    pt_PT: () => import('element-plus/lib/locale/lang/pt'),
    uk: () => import('element-plus/lib/locale/lang/uk'),
    es: () => import('element-plus/lib/locale/lang/es'),
    de: () => import('element-plus/lib/locale/lang/de'),
    fr: () => import('element-plus/lib/locale/lang/fr'),
}

let EL_LOCALE: Language = null
let EL_LOCALE_FALLBACK: Language = null

export const initElementLocale = async (app: App) => {
    const module = await LOCALES[locale]?.()
    EL_LOCALE = module?.default
    app.use(ElementPlus, { locale: EL_LOCALE })
    EL_LOCALE_FALLBACK = (await LOCALES[FEEDBACK_LOCALE]?.())?.default
}

export const EL_DATE_FORMAT = t(calendarMessages, { key: msg => msg.dateFormat, param: { y: 'YYYY', m: 'MM', d: 'DD' } })

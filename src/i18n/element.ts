import type { Language } from "element-plus/lib/locale"
import type { App } from "vue"
import ElementPlus from 'element-plus'
import { FEEDBACK_LOCALE, locale } from "."

const LOCALES: { [locale in timer.Locale]: () => Promise<{ default: Language }> } = {
    zh_CN: () => import('element-plus/lib/locale/lang/zh-cn'),
    zh_TW: () => import('element-plus/lib/locale/lang/zh-tw'),
    en: () => import('element-plus/lib/locale/lang/en'),
    ja: () => import('element-plus/lib/locale/lang/ja'),
    pt_PT: () => import('element-plus/lib/locale/lang/pt'),
    uk: () => import('element-plus/lib/locale/lang/uk'),
    es: () => import('element-plus/lib/locale/lang/es'),
    de: () => import('element-plus/lib/locale/lang/de'),
}

let EL_LOCALE: Language = null
let EL_LOCALE_FALLBACK: Language = null

export const initElementLocale = async (app: App) => {
    const module = await LOCALES[locale]?.()
    EL_LOCALE = module?.default
    app.use(ElementPlus, { locale: EL_LOCALE })
    EL_LOCALE_FALLBACK = (await LOCALES[FEEDBACK_LOCALE]?.())?.default
}

type I18nKey = (lang: Language['el']) => string

export const tEl = (key: I18nKey): string => {
    const locale = EL_LOCALE || EL_LOCALE_FALLBACK
    return key?.(locale?.el)
}
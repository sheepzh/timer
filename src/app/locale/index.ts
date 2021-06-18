
import { I18nKey as _I18nKey, locale as _locale, t as _t } from "../../util/i18n"
import { tN as _tN } from '../../util/i18n/i18n-vue'
import messages, { AppMessage } from "./messages"

const message = messages[_locale]

export type I18nKey = _I18nKey<AppMessage>

export function t(key: I18nKey, param?: any) {
    const props = { key, param }
    return _t<AppMessage>(message, props)
}

export function tN(key: I18nKey, param?: any) {
    return _tN<AppMessage>(message, { key, param })
}

export const locale = _locale
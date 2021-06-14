
import { I18nKey as _I18nKey, locale as _locale, t as _t } from "../../util/i18n"
import messages, { PopupMessage } from "./messages"

const message = messages[_locale]

export type I18nKey = _I18nKey<PopupMessage>

export const t = (key: I18nKey, param?: any) => {
    return _t<PopupMessage>(message, key, param)
}

export const locale = _locale
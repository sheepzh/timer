/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { I18nKey as _I18nKey, locale, t as _t } from "@util/i18n"
import messages, { PopupMessage } from "./messages"

export type I18nKey = _I18nKey<PopupMessage>

export const t = (key: I18nKey, param?: any) => {
    const props = { key, param }
    return _t<PopupMessage>(messages[locale], props)
}

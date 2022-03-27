/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { I18nKey as _I18nKey, locale, t as _t } from "@util/i18n"
import { tN as _tN } from "@util/i18n/i18n-vue"
import messages, { AppMessage } from "./messages"

export type I18nKey = _I18nKey<AppMessage>

export function t(key: I18nKey, param?: any) {
    const props = { key, param }
    return _t<AppMessage>(messages[locale], props)
}

export function tN(key: I18nKey, param?: any) {
    return _tN<AppMessage>(messages[locale], { key, param })
}
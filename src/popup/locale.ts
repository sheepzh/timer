/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { I18nKey as _I18nKey, t as _t } from "@i18n"
import messages, { PopupMessage } from "@i18n/message/popup"

export type I18nKey = _I18nKey<PopupMessage>

export const t = (key: I18nKey, param?: any) => {
    const props = { key, param }
    return _t<PopupMessage>(messages, props)
}

/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { I18nKey as _I18nKey, t as _t, tN as _tN } from "@i18n"
import messages, { GuideMessage } from "@i18n/message/guide"
import { VNode } from "vue"

export type I18nKey = _I18nKey<GuideMessage>

export function t(key: I18nKey, param?: any) {
    const props = { key, param }
    return _t<GuideMessage>(messages, props)
}

export function tN(key: I18nKey, param?: any) {
    const props = { key, param }
    return _tN<GuideMessage, VNode>(messages, props)
}
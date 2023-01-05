/**
 * Copyright (c) 2022 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import type { I18nKey } from "@i18n"
import type { ContentScriptMessage } from "@i18n/message/common/content-script"

import { t as t_ } from "@i18n"
import messages from "@i18n/message/common/content-script"

export function t(key: I18nKey<ContentScriptMessage>): string {
    return t_(messages, { key })
}
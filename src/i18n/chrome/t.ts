/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { getMessage } from "@api/chrome/i18n"
import messages, { router, ChromeMessage } from "./message"
import { t } from ".."

export const keyPathOf = (key: (root: ChromeMessage) => string) => key(router)

export const t2Chrome = (key: (root: ChromeMessage) => string) => {
    if (getMessage) {
        return getMessage(keyPathOf(key))
    }
    return t<ChromeMessage>(messages, { key }, 'en')
}

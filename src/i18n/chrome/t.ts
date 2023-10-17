/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { getMessage } from "@api/chrome/i18n"
import messages, { router, ChromeMessage } from "./message"
import { IS_CHROME } from "@util/constant/environment"
import { t } from ".."

export const keyPathOf = (key: (root: ChromeMessage) => string) => key(router)

export const t2Chrome = (key: (root: ChromeMessage) => string) => {
    if (getMessage) {
        return getMessage(keyPathOf(key))
    }
    console.error(IS_CHROME)
    return t<ChromeMessage>(messages, { key }, 'en')
}

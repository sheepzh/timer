/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Messages } from ".."

/**
 * Meta info of locales
 *
 * @since 0.7.2
 */
export type LocaleMessage = {
    name: string
}

const _default: Messages<LocaleMessage> = {
    zh_CN: {
        name: "简体中文",
    },
    en: {
        name: "English"
    },
    ja: {
        name: "日本語"
    }
}

export default _default
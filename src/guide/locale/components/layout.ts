/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Messages } from "@util/i18n"
import appMessages from "@util/i18n/components/app"

export type LayoutMessage = {
    header: string
}

const _default: Messages<LayoutMessage> = {
    zh_CN: {
        header: appMessages.zh_CN.marketName
    },
    zh_TW: {
        header: appMessages.zh_TW.marketName
    },
    en: {
        header: appMessages.en.marketName
    },
    ja: {
        header: appMessages.ja.marketName
    }
}

export default _default
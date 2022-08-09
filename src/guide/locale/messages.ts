/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Messages } from "@util/i18n"
import layoutMessages, { LayoutMessage } from "./components/layout"

export type GuideMessage = {
    layout: LayoutMessage
}

const _default: Messages<GuideMessage> = {
    zh_CN: {
        layout: layoutMessages.zh_CN
    },
    zh_TW: {
        layout: layoutMessages.zh_TW
    },
    en: {
        layout: layoutMessages.en
    },
    ja: {
        layout: layoutMessages.ja
    },
}

export default _default
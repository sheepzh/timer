/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Messages } from "@util/i18n"
import layoutMessages, { LayoutMessage } from "./components/layout"
import profileMessages, { ProfileMessage } from "./components/profile"
import usageMessages, { UsageMessage } from "./components/usage"
import privacyMessages, { PrivacyMessage } from "./components/privacy"

export type GuideMessage = {
    layout: LayoutMessage
    profile: ProfileMessage
    usage: UsageMessage
    privacy: PrivacyMessage
}

const _default: Messages<GuideMessage> = {
    zh_CN: {
        layout: layoutMessages.zh_CN,
        profile: profileMessages.zh_CN,
        usage: usageMessages.zh_CN,
        privacy: privacyMessages.zh_CN,
    },
    zh_TW: {
        layout: layoutMessages.zh_TW,
        profile: profileMessages.zh_TW,
        usage: usageMessages.zh_TW,
        privacy: privacyMessages.zh_TW,
    },
    en: {
        layout: layoutMessages.en,
        profile: profileMessages.en,
        usage: usageMessages.en,
        privacy: privacyMessages.en,
    },
    ja: {
        layout: layoutMessages.ja,
        profile: profileMessages.ja,
        usage: usageMessages.ja,
        privacy: privacyMessages.ja,
    },
}

export default _default
/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import layoutMessages, { LayoutMessage } from "./layout"
import profileMessages, { ProfileMessage } from "./profile"
import usageMessages, { UsageMessage } from "./usage"
import privacyMessages, { PrivacyMessage } from "./privacy"
import metaMessages, { MetaMessage } from "../common/meta"
import baseMessages, { BaseMessage } from "../common/base"

export type GuideMessage = {
    layout: LayoutMessage
    profile: ProfileMessage
    usage: UsageMessage
    privacy: PrivacyMessage
    meta: MetaMessage
    base: BaseMessage
}

const _default: Messages<GuideMessage> = {
    zh_CN: {
        layout: layoutMessages.zh_CN,
        profile: profileMessages.zh_CN,
        usage: usageMessages.zh_CN,
        privacy: privacyMessages.zh_CN,
        meta: metaMessages.zh_CN,
        base: baseMessages.zh_CN,
    },
    zh_TW: {
        layout: layoutMessages.zh_TW,
        profile: profileMessages.zh_TW,
        usage: usageMessages.zh_TW,
        privacy: privacyMessages.zh_TW,
        meta: metaMessages.zh_TW,
        base: baseMessages.zh_TW,
    },
    en: {
        layout: layoutMessages.en,
        profile: profileMessages.en,
        usage: usageMessages.en,
        privacy: privacyMessages.en,
        meta: metaMessages.en,
        base: baseMessages.en,
    },
    ja: {
        layout: layoutMessages.ja,
        profile: profileMessages.ja,
        usage: usageMessages.ja,
        privacy: privacyMessages.ja,
        meta: metaMessages.ja,
        base: baseMessages.ja,
    },
}

export default _default
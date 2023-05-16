/**
 * Copyright (c) 2022-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import layoutMessages, { LayoutMessage } from "./layout"
import startMessages, { StartMessage } from "./start"
import privacyMessages, { PrivacyMessage } from "./privacy"
import metaMessages, { MetaMessage } from "../common/meta"
import baseMessages, { BaseMessage } from "../common/base"
import homeMessages, { HomeMessage } from "./home"
import appMessages, { AppMessage } from "./app"
import mergeMessages, { MergeMessage } from "./merge"
import virtualMessages, { VirtualMessage } from "./virtual"
import limitMessages, { LimitMessage } from "./limit"
import backupMessages, { BackupMessage } from "./backup"
import mergeCommonMessages, { MergeCommonMessage } from "../common/merge"
import appMenuMessages, { MenuMessage as AppMenuMessage } from "../app/menu"

export type GuideMessage = {
    mergeCommon: MergeCommonMessage
    layout: LayoutMessage
    home: HomeMessage
    start: StartMessage
    privacy: PrivacyMessage
    meta: MetaMessage
    base: BaseMessage
    app: AppMessage
    merge: MergeMessage
    virtual: VirtualMessage
    limit: LimitMessage
    backup: BackupMessage
    appMenu: AppMenuMessage
}

const _default: Messages<GuideMessage> = {
    zh_CN: {
        mergeCommon: mergeCommonMessages.zh_CN,
        layout: layoutMessages.zh_CN,
        home: homeMessages.zh_CN,
        start: startMessages.zh_CN,
        privacy: privacyMessages.zh_CN,
        meta: metaMessages.zh_CN,
        base: baseMessages.zh_CN,
        app: appMessages.zh_CN,
        merge: mergeMessages.zh_CN,
        virtual: virtualMessages.zh_CN,
        limit: limitMessages.zh_CN,
        backup: backupMessages.zh_CN,
        appMenu: appMenuMessages.zh_CN,
    },
    zh_TW: {
        mergeCommon: mergeCommonMessages.zh_TW,
        layout: layoutMessages.zh_TW,
        home: homeMessages.zh_TW,
        start: startMessages.zh_TW,
        privacy: privacyMessages.zh_TW,
        meta: metaMessages.zh_TW,
        base: baseMessages.zh_TW,
        app: appMessages.zh_TW,
        merge: mergeMessages.zh_TW,
        virtual: virtualMessages.zh_TW,
        limit: limitMessages.zh_TW,
        backup: backupMessages.zh_TW,
        appMenu: appMenuMessages.zh_TW,
    },
    en: {
        mergeCommon: mergeCommonMessages.en,
        layout: layoutMessages.en,
        home: homeMessages.en,
        start: startMessages.en,
        privacy: privacyMessages.en,
        meta: metaMessages.en,
        base: baseMessages.en,
        app: appMessages.en,
        merge: mergeMessages.en,
        virtual: virtualMessages.en,
        limit: limitMessages.en,
        backup: backupMessages.en,
        appMenu: appMenuMessages.en,
    },
    ja: {
        mergeCommon: mergeCommonMessages.ja,
        layout: layoutMessages.ja,
        home: homeMessages.ja,
        start: startMessages.ja,
        privacy: privacyMessages.ja,
        meta: metaMessages.ja,
        base: baseMessages.ja,
        app: appMessages.ja,
        merge: mergeMessages.ja,
        virtual: virtualMessages.ja,
        limit: limitMessages.ja,
        backup: backupMessages.ja,
        appMenu: appMenuMessages.ja,
    },
    pt: {
        mergeCommon: mergeCommonMessages.pt,
        layout: layoutMessages.pt,
        home: homeMessages.pt,
        start: startMessages.pt,
        privacy: privacyMessages.pt,
        meta: metaMessages.pt,
        base: baseMessages.pt,
        app: appMessages.pt,
        merge: mergeMessages.pt,
        virtual: virtualMessages.pt,
        limit: limitMessages.pt,
        backup: backupMessages.pt,
        appMenu: appMenuMessages.pt,
    },
}

export default _default
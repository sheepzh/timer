/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import baseMessages, { BaseMessage } from "../common/base"
import itemMessages, { ItemMessage } from "../common/item"
import metaMessages, { MetaMessage } from "../common/meta"
import popupDurationMessages, { PopupDurationMessage } from "../common/popup-duration"
import chartMessages, { ChartMessage } from "./chart"

export type PopupMessage = {
    chart: ChartMessage
    duration: PopupDurationMessage
    item: ItemMessage
    meta: MetaMessage
    base: BaseMessage
}

const _default: Required<Messages<PopupMessage>> = {
    zh_CN: {
        chart: chartMessages.zh_CN,
        duration: popupDurationMessages.zh_CN,
        item: itemMessages.zh_CN,
        meta: metaMessages.zh_CN,
        base: baseMessages.zh_CN,
    },
    zh_TW: {
        chart: chartMessages.zh_TW,
        duration: popupDurationMessages.zh_TW,
        item: itemMessages.zh_TW,
        meta: metaMessages.zh_TW,
        base: baseMessages.zh_TW,
    },
    en: {
        chart: chartMessages.en,
        duration: popupDurationMessages.en,
        item: itemMessages.en,
        meta: metaMessages.en,
        base: baseMessages.en,
    },
    ja: {
        chart: chartMessages.ja,
        duration: popupDurationMessages.ja,
        item: itemMessages.ja,
        meta: metaMessages.ja,
        base: baseMessages.ja,
    },
    pt_PT: {
        chart: chartMessages.pt_PT,
        duration: popupDurationMessages.pt_PT,
        item: itemMessages.pt_PT,
        meta: metaMessages.pt_PT,
        base: baseMessages.pt_PT,
    },
    uk: {
        chart: chartMessages.uk,
        duration: popupDurationMessages.uk,
        item: itemMessages.uk,
        meta: metaMessages.uk,
        base: baseMessages.uk,
    }
}

export default _default
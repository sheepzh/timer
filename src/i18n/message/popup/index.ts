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
import footerMessages, { FooterMessage } from "./footer"
import { merge, MessageRoot } from "../merge"

export type PopupMessage = {
    chart: ChartMessage
    duration: PopupDurationMessage
    item: ItemMessage
    meta: MetaMessage
    base: BaseMessage
    footer: FooterMessage
}

const MESSAGE_ROOT: MessageRoot<PopupMessage> = {
    chart: chartMessages,
    duration: popupDurationMessages,
    item: itemMessages,
    meta: metaMessages,
    base: baseMessages,
    footer: footerMessages
}

const _default = merge<PopupMessage>(MESSAGE_ROOT)

export default _default
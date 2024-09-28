/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import menuMessages, { MenuMessage } from "../app/menu"
import baseMessages, { BaseMessage } from "../common/base"
import calendarMessages, { CalendarMessage } from "../common/calendar"
import itemMessages, { ItemMessage } from "../common/item"
import metaMessages, { MetaMessage } from "../common/meta"
import { merge, MessageRoot } from "../merge"
import chartMessages, { ChartMessage } from "./chart"
import footerMessages, { FooterMessage } from "./footer"

export type PopupMessage = {
    chart: ChartMessage
    item: ItemMessage
    meta: MetaMessage
    base: BaseMessage
    footer: FooterMessage
    menu: MenuMessage
    calendar: CalendarMessage
}

const MESSAGE_ROOT: MessageRoot<PopupMessage> = {
    chart: chartMessages,
    item: itemMessages,
    meta: metaMessages,
    base: baseMessages,
    footer: footerMessages,
    menu: menuMessages,
    calendar: calendarMessages,
}

const _default = merge<PopupMessage>(MESSAGE_ROOT)

export default _default
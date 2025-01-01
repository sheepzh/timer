/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import menuMessages, { type MenuMessage } from "../app/menu"
import baseMessages, { type BaseMessage } from "../common/base"
import calendarMessages, { type CalendarMessage } from "../common/calendar"
import itemMessages, { type ItemMessage } from "../common/item"
import metaMessages, { type MetaMessage } from "../common/meta"
import { merge, type MessageRoot } from "../merge"
import chartMessages, { type ChartMessage } from "./chart"
import footerMessages, { type FooterMessage } from "./footer"

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
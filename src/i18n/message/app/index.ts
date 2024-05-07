/**
 * Copyright (c) 2021-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import itemMessages, { ItemMessage } from "@i18n/message/common/item"
import mergeCommonMessages, { MergeCommonMessage } from "@i18n/message/common/merge"
import dataManageMessages, { DataManageMessage } from "./data-manage"
import reportMessages, { ReportMessage } from "./report"
import analysisMessages, { AnalysisMessage } from "./analysis"
import menuMessages, { MenuMessage } from "./menu"
import habitMessages, { HabitMessage } from "./habit"
import limitMessages, { LimitMessage } from "./limit"
import optionMessages, { OptionMessage } from "./option"
import whitelistMessages, { WhitelistMessage } from "./whitelist"
import mergeRuleMessages, { MergeRuleMessage } from "./merge-rule"
import siteManageManages, { SiteManageMessage } from "./site-manage"
import operationMessages, { OperationMessage } from './operation'
import dashboardMessages, { DashboardMessage } from "./dashboard"
import timeFormatMessages, { TimeFormatMessage } from "./time-format"
import helpUsMessages, { HelpUsMessage } from "./help-us"
import calendarMessages, { CalendarMessage } from "@i18n/message/common/calendar"
import popupDurationMessages, { PopupDurationMessage } from "@i18n/message/common/popup-duration"
import buttonMessages, { ButtonMessage } from "@i18n/message/common/button"
import metaMessages, { MetaMessage } from "@i18n/message/common/meta"
import aboutMessages, { AboutMessage } from "./about"
import baseMessages, { BaseMessage } from "../common/base"
import limitModalMessages, { ModalMessage } from "../cs/modal"
import { merge, type MessageRoot } from "../merge"

export type AppMessage = {
    about: AboutMessage
    dataManage: DataManageMessage
    item: ItemMessage
    mergeCommon: MergeCommonMessage
    report: ReportMessage
    whitelist: WhitelistMessage
    mergeRule: MergeRuleMessage
    option: OptionMessage
    analysis: AnalysisMessage
    menu: MenuMessage
    habit: HabitMessage
    limit: LimitMessage
    siteManage: SiteManageMessage
    operation: OperationMessage
    dashboard: DashboardMessage
    calendar: CalendarMessage
    timeFormat: TimeFormatMessage
    duration: PopupDurationMessage
    helpUs: HelpUsMessage
    button: ButtonMessage
    meta: MetaMessage
    base: BaseMessage
    limitModal: ModalMessage
}

const MESSAGE_ROOT: MessageRoot<AppMessage> = {
    about: aboutMessages,
    dataManage: dataManageMessages,
    item: itemMessages,
    mergeCommon: mergeCommonMessages,
    report: reportMessages,
    whitelist: whitelistMessages,
    mergeRule: mergeRuleMessages,
    option: optionMessages,
    analysis: analysisMessages,
    menu: menuMessages,
    habit: habitMessages,
    limit: limitMessages,
    siteManage: siteManageManages,
    operation: operationMessages,
    dashboard: dashboardMessages,
    calendar: calendarMessages,
    timeFormat: timeFormatMessages,
    duration: popupDurationMessages,
    helpUs: helpUsMessages,
    button: buttonMessages,
    meta: metaMessages,
    base: baseMessages,
    limitModal: limitModalMessages,
}

const _default = merge<AppMessage>(MESSAGE_ROOT)

export default _default
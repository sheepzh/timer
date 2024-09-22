/**
 * Copyright (c) 2021-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import buttonMessages, { ButtonMessage } from "@i18n/message/common/button"
import calendarMessages, { CalendarMessage } from "@i18n/message/common/calendar"
import itemMessages, { ItemMessage } from "@i18n/message/common/item"
import mergeCommonMessages, { MergeCommonMessage } from "@i18n/message/common/merge"
import metaMessages, { MetaMessage } from "@i18n/message/common/meta"
import baseMessages, { BaseMessage } from "../common/base"
import limitModalMessages, { ModalMessage } from "../cs/modal"
import { merge, type MessageRoot } from "../merge"
import aboutMessages, { AboutMessage } from "./about"
import analysisMessages, { AnalysisMessage } from "./analysis"
import dashboardMessages, { DashboardMessage } from "./dashboard"
import dataManageMessages, { DataManageMessage } from "./data-manage"
import habitMessages, { HabitMessage } from "./habit"
import helpUsMessages, { HelpUsMessage } from "./help-us"
import limitMessages, { LimitMessage } from "./limit"
import menuMessages, { MenuMessage } from "./menu"
import mergeRuleMessages, { MergeRuleMessage } from "./merge-rule"
import operationMessages, { OperationMessage } from './operation'
import optionMessages, { OptionMessage } from "./option"
import reportMessages, { ReportMessage } from "./report"
import siteManageManages, { SiteManageMessage } from "./site-manage"
import timeFormatMessages, { TimeFormatMessage } from "./time-format"
import whitelistMessages, { WhitelistMessage } from "./whitelist"

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
    helpUs: helpUsMessages,
    button: buttonMessages,
    meta: metaMessages,
    base: baseMessages,
    limitModal: limitModalMessages,
}

const _default = merge<AppMessage>(MESSAGE_ROOT)

export default _default
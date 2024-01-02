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
import confirmMessages, { ConfirmMessage } from './confirm'
import dashboardMessages, { DashboardMessage } from "./dashboard"
import timeFormatMessages, { TimeFormatMessage } from "./time-format"
import helpUsMessages, { HelpUsMessage } from "./help-us"
import calendarMessages, { CalendarMessage } from "@i18n/message/common/calendar"
import popupDurationMessages, { PopupDurationMessage } from "@i18n/message/common/popup-duration"
import buttonMessages, { ButtonMessage } from "@i18n/message/common/button"

export type AppMessage = {
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
    confirm: ConfirmMessage
    dashboard: DashboardMessage
    calendar: CalendarMessage
    timeFormat: TimeFormatMessage
    duration: PopupDurationMessage
    helpUs: HelpUsMessage
    button: ButtonMessage
}

const CHILD_MESSAGES: { [key in keyof AppMessage]: Messages<AppMessage[key]> } = {
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
    confirm: confirmMessages,
    dashboard: dashboardMessages,
    calendar: calendarMessages,
    timeFormat: timeFormatMessages,
    duration: popupDurationMessages,
    helpUs: helpUsMessages,
    button: buttonMessages,
}

function appMessageOf(locale: timer.Locale): AppMessage {
    const entries: [string, any][] = Object.entries(CHILD_MESSAGES).map(([key, val]) => ([key, val[locale]]))
    const result = Object.fromEntries(entries) as AppMessage
    return result
}

const _default: Required<Messages<AppMessage>> = {
    zh_CN: appMessageOf('zh_CN'),
    zh_TW: appMessageOf('zh_TW'),
    en: appMessageOf('en'),
    ja: appMessageOf('ja'),
    pt_PT: appMessageOf('pt_PT'),
    uk: appMessageOf('uk'),
}

export default _default
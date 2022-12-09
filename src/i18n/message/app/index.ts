/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import itemMessages, { ItemMessage } from "@i18n/message/common/item"
import dataManageMessages, { DataManageMessage } from "./data-manage"
import reportMessages, { ReportMessage } from "./report"
import trendMessages, { TrendMessage } from "./trend"
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
import calendarMessages, { CalendarMessage } from "@i18n/message/common/calendar"
import popupDurationMessages, { PopupDurationMessage } from "@i18n/message/common/popup-duration"
import helpUsMessages, { HelpUsMessage } from "./help-us"

export type AppMessage = {
    dataManage: DataManageMessage
    item: ItemMessage
    report: ReportMessage
    whitelist: WhitelistMessage
    mergeRule: MergeRuleMessage
    option: OptionMessage
    trend: TrendMessage
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
}

const _default: Messages<AppMessage> = {
    zh_CN: {
        dataManage: dataManageMessages.zh_CN,
        item: itemMessages.zh_CN,
        report: reportMessages.zh_CN,
        whitelist: whitelistMessages.zh_CN,
        mergeRule: mergeRuleMessages.zh_CN,
        option: optionMessages.zh_CN,
        trend: trendMessages.zh_CN,
        menu: menuMessages.zh_CN,
        habit: habitMessages.zh_CN,
        limit: limitMessages.zh_CN,
        siteManage: siteManageManages.zh_CN,
        operation: operationMessages.zh_CN,
        confirm: confirmMessages.zh_CN,
        dashboard: dashboardMessages.zh_CN,
        calendar: calendarMessages.zh_CN,
        timeFormat: timeFormatMessages.zh_CN,
        duration: popupDurationMessages.zh_CN,
        helpUs: helpUsMessages.zh_CN,
    },
    zh_TW: {
        dataManage: dataManageMessages.zh_TW,
        item: itemMessages.zh_TW,
        report: reportMessages.zh_TW,
        whitelist: whitelistMessages.zh_TW,
        mergeRule: mergeRuleMessages.zh_TW,
        option: optionMessages.zh_TW,
        trend: trendMessages.zh_TW,
        menu: menuMessages.zh_TW,
        habit: habitMessages.zh_TW,
        limit: limitMessages.zh_TW,
        siteManage: siteManageManages.zh_TW,
        operation: operationMessages.zh_TW,
        confirm: confirmMessages.zh_TW,
        dashboard: dashboardMessages.zh_TW,
        calendar: calendarMessages.zh_TW,
        timeFormat: timeFormatMessages.zh_TW,
        duration: popupDurationMessages.zh_TW,
        helpUs: helpUsMessages.zh_TW,
    },
    en: {
        dataManage: dataManageMessages.en,
        item: itemMessages.en,
        report: reportMessages.en,
        whitelist: whitelistMessages.en,
        mergeRule: mergeRuleMessages.en,
        option: optionMessages.en,
        trend: trendMessages.en,
        menu: menuMessages.en,
        habit: habitMessages.en,
        limit: limitMessages.en,
        siteManage: siteManageManages.en,
        operation: operationMessages.en,
        confirm: confirmMessages.en,
        dashboard: dashboardMessages.en,
        calendar: calendarMessages.en,
        timeFormat: timeFormatMessages.en,
        duration: popupDurationMessages.en,
        helpUs: helpUsMessages.en,
    },
    ja: {
        dataManage: dataManageMessages.ja,
        item: itemMessages.ja,
        report: reportMessages.ja,
        whitelist: whitelistMessages.ja,
        mergeRule: mergeRuleMessages.ja,
        option: optionMessages.ja,
        trend: trendMessages.ja,
        menu: menuMessages.ja,
        habit: habitMessages.ja,
        limit: limitMessages.ja,
        siteManage: siteManageManages.ja,
        operation: operationMessages.ja,
        confirm: confirmMessages.ja,
        dashboard: dashboardMessages.ja,
        calendar: calendarMessages.ja,
        timeFormat: timeFormatMessages.ja,
        duration: popupDurationMessages.ja,
        helpUs: helpUsMessages.ja,
    }
}

export default _default
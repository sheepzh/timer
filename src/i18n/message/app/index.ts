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

const _default: Messages<AppMessage> = {
    zh_CN: {
        dataManage: dataManageMessages.zh_CN,
        item: itemMessages.zh_CN,
        mergeCommon: mergeCommonMessages.zh_CN,
        report: reportMessages.zh_CN,
        whitelist: whitelistMessages.zh_CN,
        mergeRule: mergeRuleMessages.zh_CN,
        option: optionMessages.zh_CN,
        analysis: analysisMessages.zh_CN,
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
        button: buttonMessages.zh_CN,
    },
    zh_TW: {
        dataManage: dataManageMessages.zh_TW,
        item: itemMessages.zh_TW,
        mergeCommon: mergeCommonMessages.zh_TW,
        report: reportMessages.zh_TW,
        whitelist: whitelistMessages.zh_TW,
        mergeRule: mergeRuleMessages.zh_TW,
        option: optionMessages.zh_TW,
        analysis: analysisMessages.zh_TW,
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
        button: buttonMessages.zh_TW,
    },
    en: {
        dataManage: dataManageMessages.en,
        item: itemMessages.en,
        mergeCommon: mergeCommonMessages.en,
        report: reportMessages.en,
        whitelist: whitelistMessages.en,
        mergeRule: mergeRuleMessages.en,
        option: optionMessages.en,
        analysis: analysisMessages.en,
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
        button: buttonMessages.en,
    },
    ja: {
        dataManage: dataManageMessages.ja,
        item: itemMessages.ja,
        mergeCommon: mergeCommonMessages.ja,
        report: reportMessages.ja,
        whitelist: whitelistMessages.ja,
        mergeRule: mergeRuleMessages.ja,
        option: optionMessages.ja,
        analysis: analysisMessages.ja,
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
        button: buttonMessages.ja,
    },
    pt: {
        dataManage: dataManageMessages.pt,
        item: itemMessages.pt,
        mergeCommon: mergeCommonMessages.pt,
        report: reportMessages.pt,
        whitelist: whitelistMessages.pt,
        mergeRule: mergeRuleMessages.pt,
        option: optionMessages.pt,
        analysis: analysisMessages.pt,
        menu: menuMessages.pt,
        habit: habitMessages.pt,
        limit: limitMessages.pt,
        siteManage: siteManageManages.pt,
        operation: operationMessages.pt,
        confirm: confirmMessages.pt,
        dashboard: dashboardMessages.pt,
        calendar: calendarMessages.pt,
        timeFormat: timeFormatMessages.pt,
        duration: popupDurationMessages.pt,
        helpUs: helpUsMessages.pt,
        button: buttonMessages.pt,
    },
}

export default _default
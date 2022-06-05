/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Messages } from "@util/i18n"
import itemMessages, { ItemMessage } from "@util/i18n/components/item"
import dataManageMessages, { DataManageMessage } from "./components/data-manage"
import reportMessages, { ReportMessage } from "./components/report"
import trendMessages, { TrendMessage } from "./components/trend"
import menuMessages, { MenuMessage } from "./components/menu"
import habitMessages, { HabitMessage } from "./components/habit"
import limitMessages, { LimitMessage } from "./components/limit"
import optionMessages, { OptionMessage } from "./components/option"
import whitelistMessages, { WhitelistMessage } from "./components/whitelist"
import mergeRuleMessages, { MergeRuleMessage } from "./components/merge-rule"
import siteManageManages, { SiteManageMessage } from "./components/site-manage"
import operationMessages, { OperationMessage } from './components/operation'
import confirmMessages, { ConfirmMessage } from './components/confirm'
import dashboardMessages, { DashboardMessage } from "./components/dashboard"
import calendarMessages, { CalendarMessage } from "@util/i18n/components/calendar"

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
    }
}

export default _default
/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Messages } from '../../util/i18n'
import itemMessages, { ItemMessage } from '../../util/i18n/components/item'
import dataManageMessages, { DataManageMessage } from './components/data-manage'
import reportMessages, { ReportMessage } from './components/report'
import trendMessages, { TrendMessage } from './components/trend'
import menuMessages, { MenuMessage } from './components/menu'
import habitMessages, { HabitMessage } from './components/habit'
import limitMessages, { LimitMessage } from './components/limit'
import optionMessages, { OptionMessage } from './components/option'
import whitelistMessages, { WhitelistMessage } from './components/whitelist'
import mergeRuleMessages, { MergeRuleMessage } from './components/merge-rule'

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
        limit: limitMessages.zh_CN
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
        limit: limitMessages.en
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
        limit: limitMessages.ja
    }
}

export default _default
import { Messages } from '../../util/i18n'
import chromeBase from '../../util/i18n/components/app'
import itemMessages, { ItemMessage } from '../../util/i18n/components/item'
import dataManageMessages, { DataManageMessage } from './components/data-manage'
import settingMessages, { SettingMessage } from './components/setting'
import reportMessages, { ReportMessage } from './components/report'
import trendMessages, { TrendMessage } from './components/trend'
import menuMessages, { MenuMessage } from './components/menu'
import habitMessages, { HabitMessage } from './components/habit'
import limitMessages, { LimitMessage } from './components/limit'

export type AppMessage = {
    app: {
        currentVersion: string
    }
    dataManage: DataManageMessage
    item: ItemMessage
    report: ReportMessage
    setting: SettingMessage
    trend: TrendMessage
    menu: MenuMessage
    habit: HabitMessage
    limit: LimitMessage
}

const _default: Messages<AppMessage> = {

    zh_CN: {
        app: { currentVersion: chromeBase.zh_CN.currentVersion },
        dataManage: dataManageMessages.zh_CN,
        item: itemMessages.zh_CN,
        report: reportMessages.zh_CN,
        setting: settingMessages.zh_CN,
        trend: trendMessages.zh_CN,
        menu: menuMessages.zh_CN,
        habit: habitMessages.zh_CN,
        limit: limitMessages.zh_CN
    },
    en: {
        app: { currentVersion: chromeBase.en.currentVersion },
        dataManage: dataManageMessages.en,
        item: itemMessages.en,
        report: reportMessages.en,
        setting: settingMessages.en,
        trend: trendMessages.en,
        menu: menuMessages.en,
        habit: habitMessages.en,
        limit: limitMessages.en
    },
    ja: {
        app: { currentVersion: chromeBase.ja.currentVersion },
        dataManage: dataManageMessages.ja,
        item: itemMessages.ja,
        report: reportMessages.ja,
        setting: settingMessages.ja,
        trend: trendMessages.ja,
        menu: menuMessages.ja,
        habit: habitMessages.ja,
        limit: limitMessages.ja
    }
}

export default _default
import itemMessages, { ItemMessage } from '../../util/i18n/components/item'
import clearMessages, { ClearMessage } from './components/clear'
import settingMessages, { SettingMessage } from './components/setting'
import reportMessages, { ReportMessage } from './components/report'
import chromeBase from '../../util/i18n/components/app'
import trenderMessages, { TrenderMessage } from './components/trender'
import menuMessages, { MenuMessage } from './components/menu'
import periodMessages, { PeriodMessage } from './components/period'
import { Messages } from '../../util/i18n'

export type AppMessage = {
    app: {
        currentVersion: string
    }
    clear: ClearMessage
    item: ItemMessage
    report: ReportMessage
    setting: SettingMessage
    trender: TrenderMessage
    menu: MenuMessage
    period: PeriodMessage
}

const _default: Messages<AppMessage> = {

    zh_CN: {
        app: { currentVersion: chromeBase.zh_CN.currentVersion },
        clear: clearMessages.zh_CN,
        item: itemMessages.zh_CN,
        report: reportMessages.zh_CN,
        setting: settingMessages.zh_CN,
        trender: trenderMessages.zh_CN,
        menu: menuMessages.zh_CN,
        period: periodMessages.zh_CN
    },
    en: {
        app: { currentVersion: chromeBase.en.currentVersion },
        clear: clearMessages.en,
        item: itemMessages.en,
        report: reportMessages.en,
        setting: settingMessages.en,
        trender: trenderMessages.en,
        menu: menuMessages.en,
        period: periodMessages.en
    },
    ja: {
        app: { currentVersion: chromeBase.ja.currentVersion },
        clear: clearMessages.ja,
        item: itemMessages.ja,
        report: reportMessages.ja,
        setting: settingMessages.ja,
        trender: trenderMessages.ja,
        menu: menuMessages.ja,
        period: periodMessages.ja
    }
}

export default _default
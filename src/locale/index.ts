import { Messages } from './constant'
import app, { AppMessage } from './components/app'
import clear, { ClearMessage } from './components/clear'
import message, { MsgMessage } from './components/message'
import item, { ItemMessage } from './components/item'
import popup, { PopupMessage } from './components/popup'
import report, { ReportMessage } from './components/report'
import trender, { TrenderMessage } from './components/trender'
import menu, { MenuMessage } from './components/menu'
import setting, { SettingMessage } from './components/setting'

type I18nMessage = {
  lang: { name: string }
  app: AppMessage
  message: MsgMessage,
  item: ItemMessage,
  popup: PopupMessage,
  report: ReportMessage,
  trender: TrenderMessage,
  menu: MenuMessage,
  setting: SettingMessage,
  clear: ClearMessage
}

const messages: Messages<I18nMessage> = {
  en: {
    lang: { name: 'English' },
    app: app.en,
    message: message.en,
    item: item.en,
    popup: popup.en,
    report: report.en,
    trender: trender.en,
    menu: menu.en,
    setting: setting.en,
    clear: clear.en
  },
  zh_CN: {
    lang: { name: '简体中文' },
    app: app.zh_CN,
    message: message.zh_CN,
    item: item.zh_CN,
    popup: popup.zh_CN,
    report: report.zh_CN,
    trender: trender.zh_CN,
    menu: menu.zh_CN,
    setting: setting.zh_CN,
    clear: clear.zh_CN
  },
  ja: {
    lang: { name: '日本語' },
    app: app.ja,
    message: message.ja,
    item: item.ja,
    popup: popup.ja,
    report: report.ja,
    trender: trender.ja,
    menu: menu.ja,
    setting: setting.ja,
    clear: clear.ja
  }
}

export default messages

// Used for export json file of chrome 
// @see [project-path]/webpack/plugins/generate-locale-for-chrome.js
// And this can be auto injected via this plugin in the future
const globalAny: any = global
globalAny.exportsToChrome = messages
const app = require('./components/app')
const message = require('./components/message')
const item = require('./components/item')
const popup = require('./components/popup')
const menu = require('./components/menu')
const report = require('./components/report')
const trender = require('./components/trender')
const setting = require('./components/setting')
const clear = require('./components/clear')
const vueMessages = {
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

// Genearate the messages used by Chrome
function translate (obj, parentKey = '') {
  const result = {}
  if (typeof obj === 'object') {
    for (const key in obj) {
      const val = obj[key]
      // key of Chrome message
      const messageKey = !!parentKey ? `${parentKey}_${key}` : key
      children = translate(val, messageKey)
      // copy from child
      for (const childKey in children) {
        result[childKey] = children[childKey]
      }
    }
  } else {
    result[parentKey] = {
      message: obj + '',
      description: 'None'
    }
  }
  return result
}
const chromeMessages = {
  // .e.g
  // en: {
  //     "lang.name": {
  //         message: "English",
  //         description: ""
  //     }
  // }
}
for (const localeName in vueMessages) {
  const result = translate(vueMessages[localeName])
  chromeMessages[localeName] = result
}

module.exports = {
  vueMessages,
  chromeMessages,
  defaultLocale: 'zh_CN'
}
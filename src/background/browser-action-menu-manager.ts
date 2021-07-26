import { OPTION_ROUTE } from "../app/router/constants"
import { APP_PAGE_URL } from "../util/constant/url"
import { t2Chrome } from "../util/i18n/chrome/t"

const allFunctionProps: chrome.contextMenus.CreateProperties = {
    id: '_timer_menu_item_app_link_',
    contexts: ['browser_action'],
    title: '🏷️ ' + t2Chrome(msg => msg.contextMenus.allFunctions),
    visible: true,
    onclick: () => chrome.tabs.create({ url: APP_PAGE_URL })
}

const optionPageProps: chrome.contextMenus.CreateProperties = {
    id: '_timer_menu_item_option_link_',
    contexts: ['browser_action'],
    title: '🥰 ' + t2Chrome(msg => msg.contextMenus.optionPage),
    visible: true,
    onclick: () => chrome.tabs.create({ url: APP_PAGE_URL + '#' + OPTION_ROUTE })
}

function init() {
    chrome.contextMenus.create(allFunctionProps)
    chrome.contextMenus.create(optionPageProps)
}

export default init
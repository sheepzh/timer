import { APP_PAGE_URL } from "../util/constant/url"
import { t2Chrome } from "../util/i18n/chrome/t"

const properties: chrome.contextMenus.CreateProperties = {
    id: '_timer_menu_item_app_link_',
    contexts: ['browser_action'],
    title: '🏷️ ' + t2Chrome(msg => msg.contextMenus.allFunctions),
    visible: true,
    onclick: () => chrome.tabs.create({ url: APP_PAGE_URL })
}

function init() {
    chrome.contextMenus.create(properties)
}

export default init
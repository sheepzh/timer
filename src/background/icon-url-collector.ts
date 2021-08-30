import IconUrlDatabase from "../database/icon-url-database"
import { IS_CHROME } from "../util/constant/environment"
import { iconUrlOfBrowser } from "../util/constant/url"
import { extractHostname } from "../util/pattern"

const iconUrlDatabase = new IconUrlDatabase(chrome.storage.local)

/**
 * Process the tab
 */
async function processTabInfo(tab: chrome.tabs.Tab): Promise<void> {
    if (!tab) return
    const url = tab.url
    if (!url) return
    const hostInfo = extractHostname(url)
    const domain = hostInfo.host
    const protocol = hostInfo.protocol
    if (!domain) return
    let favIconUrl = tab.favIconUrl
    // localhost hosts with Chrome use cache, so keep the favIcon url undefined
    IS_CHROME && /^localhost(:.+)?/.test(domain) && (favIconUrl = undefined)
    const iconUrl = favIconUrl || await iconUrlOfBrowser(protocol, domain)
    iconUrlDatabase.put(domain, iconUrl)
}

/**
 * Fire when the web navigation completed
 */
function handleWebNavigationCompleted(detail: chrome.webNavigation.WebNavigationFramedCallbackDetails) {
    if (detail.frameId > 0) {
        // we don't care about activity occurring within a sub frame of a tab
        return
    }
    chrome.tabs.get(detail.tabId, processTabInfo)
}

function listen() {
    chrome.webNavigation.onCompleted.addListener(handleWebNavigationCompleted)
}

/**
 * Collect the favicon of host
 */
class IconUrlCollector {
    listen = listen
}

export default IconUrlCollector
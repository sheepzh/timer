import { DomainSource } from "../entity/dto/domain-alias"
import DomainAliasDatabase from "../database/domain-alias-database"
import IconUrlDatabase from "../database/icon-url-database"
import { IS_CHROME } from "../util/constant/environment"
import { iconUrlOfBrowser } from "../util/constant/url"
import { extractHostname, isHomepage } from "../util/pattern"

const iconUrlDatabase = new IconUrlDatabase(chrome.storage.local)
const domainAliasDatabase = new DomainAliasDatabase(chrome.storage.local)

function detectAlias(domain: string, tab: chrome.tabs.Tab) {
    let title = tab.title
    if (!title) return
    if (title.includes('-')) {
        title = title.split('-').map(a => a.trim()).sort((a, b) => a.length - b.length)[0]
    }
    if (title.includes('|')) {
        title = title.split('|').map(a => a.trim()).sort((a, b) => a.length - b.length)[0]
    }
    domainAliasDatabase.update({ name: title, domain, source: DomainSource.DETECTED })
}

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

    isHomepage(url) && detectAlias(domain, tab)
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
class IconAndAliasCollector {
    listen = listen
}

export default IconAndAliasCollector
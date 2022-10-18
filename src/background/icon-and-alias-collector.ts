/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import HostAliasDatabase from "@db/host-alias-database"
import IconUrlDatabase from "@db/icon-url-database"
import OptionDatabase from "@db/option-database"
import { IS_CHROME, IS_SAFARI } from "@util/constant/environment"
import { iconUrlOfBrowser } from "@util/constant/url"
import { extractHostname, isBrowserUrl, isHomepage } from "@util/pattern"
import { defaultStatistics } from "@util/constant/option"
import { extractSiteName } from "@util/site"

const storage: chrome.storage.StorageArea = chrome.storage.local
const iconUrlDatabase = new IconUrlDatabase(storage)
const hostAliasDatabase = new HostAliasDatabase(storage)
const optionDatabase = new OptionDatabase(storage)

let collectAliasEnabled = defaultStatistics().collectSiteName
const setCollectAliasEnabled = (opt: timer.option.AllOption) => collectAliasEnabled = opt.collectSiteName
optionDatabase.getOption().then(setCollectAliasEnabled)
optionDatabase.addOptionChangeListener(setCollectAliasEnabled)

function isUrl(title: string) {
    return title.startsWith('https://') || title.startsWith('http://') || title.startsWith('ftp://')
}

function collectAlias(host: string, tabTitle: string) {
    if (isUrl(tabTitle)) return
    if (!tabTitle) return
    const siteName = extractSiteName(tabTitle, host)
    siteName && hostAliasDatabase.update({ name: siteName, host, source: 'DETECTED' })
}

/**
 * Process the tab
 */
async function processTabInfo(tab: chrome.tabs.Tab): Promise<void> {
    if (!tab) return
    const url = tab.url
    if (!url) return
    if (isBrowserUrl(url)) return
    const hostInfo = extractHostname(url)
    const host = hostInfo.host
    const protocol = hostInfo.protocol
    if (!host) return
    let favIconUrl = tab.favIconUrl
    // localhost hosts with Chrome use cache, so keep the favIcon url undefined
    IS_CHROME && /^localhost(:.+)?/.test(host) && (favIconUrl = undefined)
    const iconUrl = favIconUrl || iconUrlOfBrowser(protocol, host)
    iconUrl && iconUrlDatabase.put(host, iconUrl)
    collectAliasEnabled && !isBrowserUrl(url) && isHomepage(url) && collectAlias(host, tab.title)
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
    !IS_SAFARI && chrome.webNavigation.onCompleted.addListener(handleWebNavigationCompleted)
}

/**
 * Collect the favicon of host
 */
class IconAndAliasCollector {
    listen = listen
}

export default IconAndAliasCollector
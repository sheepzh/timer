/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { HostAliasSource } from "../entity/dao/host-alias"
import HostAliasDatabase from "../database/host-alias-database"
import IconUrlDatabase from "../database/icon-url-database"
import OptionDatabase from "../database/option-database"
import { IS_CHROME } from "../util/constant/environment"
import { iconUrlOfBrowser } from "../util/constant/url"
import { extractHostname, isBrowserUrl, isHomepage } from "../util/pattern"
import { defaultStatistics } from "../util/constant/option"
import { extractSiteName } from "../util/site"

const storage: chrome.storage.StorageArea = chrome.storage.local
const iconUrlDatabase = new IconUrlDatabase(storage)
const hostAliasDatabase = new HostAliasDatabase(storage)
const optionDatabase = new OptionDatabase(storage)

let collectAliasEnabled = defaultStatistics().collectSiteName
const setCollectAliasEnabled = (opt: Timer.Option) => collectAliasEnabled = opt.collectSiteName
optionDatabase.getOption().then(setCollectAliasEnabled)
optionDatabase.addOptionChangeListener(setCollectAliasEnabled)

function isUrl(title: string) {
    return title.startsWith('https://') || title.startsWith('http://') || title.startsWith('ftp://')
}

function collectAlias(host: string, tabTitle: string) {
    if (isUrl(tabTitle)) return
    if (!tabTitle) return
    const siteName = extractSiteName(tabTitle)
    siteName && hostAliasDatabase.update({ name: siteName, host, source: HostAliasSource.DETECTED })
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
    iconUrlDatabase.put(host, iconUrl)

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
    chrome.webNavigation.onCompleted.addListener(handleWebNavigationCompleted)
}

/**
 * Collect the favicon of host
 */
class IconAndAliasCollector {
    listen = listen
}

export default IconAndAliasCollector
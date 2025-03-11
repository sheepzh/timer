/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { getTab } from "@api/chrome/tab"
import OptionDatabase from "@db/option-database"
import siteService from "@service/site-service"
import { IS_ANDROID, IS_CHROME, IS_SAFARI } from "@util/constant/environment"
import { defaultStatistics } from "@util/constant/option"
import { extractHostname, isBrowserUrl, isHomepage } from "@util/pattern"
import { extractSiteName } from "@util/site"

const storage: chrome.storage.StorageArea = chrome.storage.local
const optionDatabase = new OptionDatabase(storage)

let collectAliasEnabled = defaultStatistics().collectSiteName
const setCollectAliasEnabled = (opt: timer.option.AllOption) => collectAliasEnabled = opt.collectSiteName
optionDatabase.getOption().then(setCollectAliasEnabled)
optionDatabase.addOptionChangeListener(setCollectAliasEnabled)

function isUrl(title: string) {
    return title.startsWith('https://') || title.startsWith('http://') || title.startsWith('ftp://')
}

async function collectAlias(key: timer.site.SiteKey, tabTitle: string) {
    if (!tabTitle) return
    if (isUrl(tabTitle)) return
    const siteName = extractSiteName(tabTitle, key.host)
    siteName && await siteService.saveAlias(key, siteName, 'DETECTED')
}

/**
 * Process the tab
 */
async function processTabInfo(tab: ChromeTab): Promise<void> {
    if (!tab) return
    const url = tab.url
    if (!url) return
    if (isBrowserUrl(url)) return
    const hostInfo = extractHostname(url)
    const host = hostInfo.host
    if (!host) return
    let favIconUrl = tab.favIconUrl
    // localhost hosts with Chrome use cache, so keep the favIcon url undefined
    IS_CHROME && /^localhost(:.+)?/.test(host) && (favIconUrl = undefined)
    const siteKey: timer.site.SiteKey = { host, type: 'normal' }
    favIconUrl && await siteService.saveIconUrl(siteKey, favIconUrl)
    collectAliasEnabled
        && !isBrowserUrl(url)
        && isHomepage(url)
        && await collectAlias(siteKey, tab.title)
}

/**
 * Collect the favicon of host
 */
export const collectIconAndAlias = async (tabId: number) => {
    if (IS_SAFARI || IS_ANDROID) return
    const tab = await getTab(tabId)
    tab && processTabInfo(tab)
}
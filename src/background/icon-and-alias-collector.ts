/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import OptionDatabase from "@db/option-database"
import { IS_CHROME, IS_SAFARI } from "@util/constant/environment"
import { extractHostname, isBrowserUrl, isHomepage } from "@util/pattern"
import { defaultStatistics } from "@util/constant/option"
import { extractSiteName } from "@util/site"
import { getTab } from "@api/chrome/tab"
import siteService from "@service/site-service"
import MessageDispatcher from "./message-dispatcher"

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
    if (isUrl(tabTitle)) return
    if (!tabTitle) return
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
    const siteKey: timer.site.SiteKey = { host }
    favIconUrl && await siteService.saveIconUrl(siteKey, favIconUrl)
    collectAliasEnabled
        && !isBrowserUrl(url)
        && isHomepage(url)
        && await collectAlias(siteKey, tab.title)
}


function init(dispatcher: MessageDispatcher) {
    const handler: timer.mq.Handler<never, void> = IS_SAFARI
        ? async () => { /* do nothing for safari */ }
        : async (_, sender) => {
            const tabId = sender?.tab?.id
            if (!tabId) return
            const tab = await getTab(tabId)
            tab && processTabInfo(tab)
        }
    dispatcher.register("cs.onInjected", handler)
}

/**
 * Collect the favicon of host
 */
class IconAndAliasCollector {
    init = init
}

export default IconAndAliasCollector
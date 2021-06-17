import IconUrlDatabase from "../database/icon-url-database"
import { IS_CHROME } from "../util/constant/environment"
import { extractHostname } from "../util/pattern"

const iconUrlDatabase = new IconUrlDatabase(chrome.storage.local)

/**
 * Collect the favicon of host
 */
class IconUrlCollector {
    listen() {
        chrome.webNavigation.onCompleted.addListener((detail) => {
            if (detail.frameId > 0) {
                // we don't care about activity occurring within a subframe of a tab
                return
            }
            chrome.tabs.get(detail.tabId, tab => {
                if (!tab) return
                const url = tab.url
                if (!url) return
                const hostInfo = extractHostname(url)
                const domain = hostInfo.host
                const protocol = hostInfo.protocol
                if (!domain) return
                let favIconUrl = tab.favIconUrl
                // localhost hosts with Chrome use cache, so keep the favIconurl undefined
                IS_CHROME && /^localhost(:.+)?/.test(domain) && (favIconUrl = undefined)
                const iconUrl = favIconUrl
                    || (IS_CHROME ? `chrome://favicon/${protocol ? protocol + '://' : ''}${domain}` : '')
                iconUrlDatabase.put(domain, iconUrl)
            })
        })
    }
}

export default IconUrlCollector
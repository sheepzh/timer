/**
 * Copyright (c) 2022-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { getUrl } from "@api/chrome/runtime"
import { createTab } from "@api/chrome/tab"
import { ANALYSIS_ROUTE, LIMIT_ROUTE } from "@app/router/constants"
import whitelistHolder from "@service/components/whitelist-holder"
import itemService from "@service/item-service"
import limitService from "@service/limit-service"
import optionService from "@service/option-service"
import { getAppPageUrl } from "@util/constant/url"
import { extractFileHost, extractHostname } from "@util/pattern"
import badgeManager from "./badge-manager"
import { collectIconAndAlias } from "./icon-and-alias-collector"
import MessageDispatcher from "./message-dispatcher"

const handleOpenAnalysisPage = (sender: ChromeMessageSender) => {
    const { tab, url } = sender || {}
    if (!url) return
    const host = extractFileHost(url) || extractHostname(url)?.host
    const appUrl = getAppPageUrl(true, ANALYSIS_ROUTE) + "?host=" + host
    const newTabUrl = getUrl(appUrl)
    const tabIndex = tab?.index
    const newTabIndex = tabIndex ? tabIndex + 1 : null
    createTab({ url: newTabUrl, index: newTabIndex })
}

const handleOpenLimitPage = (sender: ChromeMessageSender) => {
    const { tab, url } = sender || {}
    if (!url) return
    const limitUrl = getAppPageUrl(true, LIMIT_ROUTE) + "?url=" + url
    const newTabUrl = getUrl(limitUrl)
    const tabIndex = tab?.index
    const newTabIndex = tabIndex ? tabIndex + 1 : null
    createTab({ url: newTabUrl, index: newTabIndex })
}

/**
 * Handle request from content script
 *
 * @param dispatcher message dispatcher
 */
export default function init(dispatcher: MessageDispatcher) {
    dispatcher
        // Increase the visit time
        .register<string | { host: string, url: string }, void>('cs.incVisitCount', async (param) => {
            let host: string, url: string = undefined
            if (typeof param === 'string') {
                host = param
            } else {
                host = param?.host
                url = param?.url
            }
            itemService.addOneTime(host, url)
        })
        // Judge is in whitelist
        .register<{ host?: string, url?: string }, boolean>('cs.isInWhitelist', ({ host, url } = {}) => whitelistHolder.contains(host, url))
        // Need to print the information of today
        .register<void, boolean>('cs.printTodayInfo', async () => {
            const option = await optionService.getAllOption()
            return !!option.printInConsole
        })
        // Get today info
        .register<string, timer.stat.Result>('cs.getTodayInfo', host => itemService.getResult(host, new Date()))
        // cs.getLimitedRules
        .register<string, timer.limit.Item[]>('cs.getLimitedRules', url => limitService.getLimited(url))
        .register<string, timer.limit.Item[]>('cs.getRelatedRules', url => limitService.getRelated(url))
        .register<void, void>('cs.openAnalysis', (_, sender) => handleOpenAnalysisPage(sender))
        .register<void, void>('cs.openLimit', (_, sender) => handleOpenLimitPage(sender))
        .register<void, void>('cs.onInjected', (_, sender) => {
            collectIconAndAlias(sender)
            badgeManager.updateFocus()
        })
}
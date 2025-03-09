/**
 * Copyright (c) 2022-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { createTab } from "@api/chrome/tab"
import { ANALYSIS_ROUTE, LIMIT_ROUTE } from "@app/router/constants"
import { t } from "@i18n"
import { t2Chrome } from "@i18n/chrome/t"
import csMessages from "@i18n/message/cs"
import optionHolder from "@service/components/option-holder"
import whitelistHolder from "@service/components/whitelist-holder"
import itemService from "@service/item-service"
import limitService from "@service/limit-service"
import siteService from "@service/site-service"
import { getAppPageUrl } from "@util/constant/url"
import { extractFileHost, extractHostname } from "@util/pattern"
import { formatPeriodCommon } from "@util/time"
import badgeManager from "./badge-manager"
import { collectIconAndAlias } from "./icon-and-alias-collector"
import MessageDispatcher from "./message-dispatcher"

const handleOpenAnalysisPage = (sender: ChromeMessageSender) => {
    const { tab, url } = sender || {}
    if (!url) return
    const host = extractFileHost(url) || extractHostname(url)?.host
    const newTabUrl = getAppPageUrl(ANALYSIS_ROUTE, { host })

    const tabIndex = tab?.index
    const newTabIndex = tabIndex ? tabIndex + 1 : null
    createTab({ url: newTabUrl, index: newTabIndex })
}

const handleOpenLimitPage = (sender: ChromeMessageSender) => {
    const { tab, url } = sender || {}
    if (!url) return
    const newTabUrl = getAppPageUrl(LIMIT_ROUTE, { url })
    const tabIndex = tab?.index
    const newTabIndex = tabIndex ? tabIndex + 1 : null
    createTab({ url: newTabUrl, index: newTabIndex })
}

async function getConsoleInfo(host: string) {
    const today = await itemService.getResult(host, new Date())
    const { time, focus } = today || {}
    const param = {
        time: `${time ?? '-'}`,
        focus: formatPeriodCommon(focus),
        host,
    }
    const appName = t2Chrome(msg => msg.meta.name)
    const info0 = t(csMessages, { key: msg => msg.console.consoleLog, param })
    const info1 = t(csMessages, { key: msg => msg.console.closeAlert, param: { appName } })
    return [info0, info1]
}

async function initContentScript(host: string, url: string): Promise<timer.mq.CsMeta> {
    const white = whitelistHolder.contains(host, url)
    if (white) {
        // In the whitelist, do nothing else
        return { white }
    }
    const option = await optionHolder.get()
    const { printInConsole } = option || {}
    const consoleInfo = printInConsole ? await getConsoleInfo(host) : undefined
    return { white, consoleInfo }
}

/**
 * Handle request from content script
 *
 * @param dispatcher message dispatcher
 */
export default function init(dispatcher: MessageDispatcher) {
    dispatcher
        // Initialization info
        .register<{ host?: string, url?: string }, timer.mq.CsMeta>('cs.init', ({ host, url }) => initContentScript(host, url))
        .register<string, timer.limit.Item[]>('cs.getLimitedRules', url => limitService.getLimited(url))
        .register<string, timer.limit.Item[]>('cs.getRelatedRules', url => limitService.getRelated(url))
        .register<void, void>('cs.openAnalysis', (_, sender) => handleOpenAnalysisPage(sender))
        .register<void, void>('cs.openLimit', (_, sender) => handleOpenLimitPage(sender))
        .register<void, void>('cs.onInjected', (_, sender) => {
            collectIconAndAlias(sender)
            badgeManager.updateFocus()
        })
        // Get sites which need to count run time
        .register<string, timer.site.SiteKey>('cs.getRunSites', async url => {
            const { host } = extractHostname(url) || {}
            if (!host) return null
            const site: timer.site.SiteKey = { host, type: 'normal' }
            const exist = await siteService.get(site)
            return exist?.run ? site : null
        })
}
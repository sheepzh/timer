/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { openLog } from "../common/logger"
import WhitelistMenuManager from "./whitelist-menu-manager"
import BrowserActionMenuManager from "./browser-action-menu-manager"
import IconAndAliasCollector from "./icon-and-alias-collector"
import Timer from "./timer"
import VersionManager from "./version-manager"
import ActiveTabListener from "./active-tab-listener"
import badgeTextManager from "./badge-text-manager"
import metaService from "@service/meta-service"
import UninstallListener from "./uninstall-listener"
import { getGuidePageUrl } from "@util/constant/url"
import MessageDispatcher from "./message-dispatcher"
import initLimitProcesser from "./limit-processor"
import initCsHandler from "./content-script-handler"
import { isBrowserUrl } from "@util/pattern"
import BackupScheduler from "./backup-scheduler"
import { createTab, listTabs } from "@api/chrome/tab"
import { getWindow, isNoneWindowId, onNormalWindowFocusChanged } from "@api/chrome/window"
import { onInstalled } from "@api/chrome/runtime"

// Open the log of console
openLog()

const messageDispatcher = new MessageDispatcher()

// Limit processor
initLimitProcesser(messageDispatcher)

// Content-script's request handler
initCsHandler(messageDispatcher)

// Start the timer
new Timer().start()

// Collect the icon url and title
new IconAndAliasCollector().listen()

// Process version
new VersionManager().init()

// Backup scheduler
new BackupScheduler().init()

// Manage the context menus
WhitelistMenuManager()

// Browser action menu
BrowserActionMenuManager()

// Badge manager
badgeTextManager.init()

// Listen to tab active changed
new ActiveTabListener()
    .register(({ url, tabId }) => badgeTextManager.forceUpdate({ url, tabId }))
    .listen()

// Collect the install time
onInstalled(async reason => {
    if (reason === "install") {
        createTab(getGuidePageUrl(true))
        await metaService.updateInstallTime(new Date())
    }
    // Questionnaire for uninstall
    new UninstallListener().listen()
})

// Start message dispatcher
messageDispatcher.start()

// Listen window focus changed
onNormalWindowFocusChanged(async windowId => {
    if (isNoneWindowId(windowId)) return
    const window = await getWindow(windowId)
    if (!window || window.type !== 'normal') return
    const tabs = await listTabs({ windowId, active: true })
    tabs.filter(tab => !isBrowserUrl(tab?.url))
        .forEach(({ url, id }) => badgeTextManager.forceUpdate({ url, tabId: id }))
})
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
import VersionManager from "./version-manager"
import ActiveTabListener from "./active-tab-listener"
import badgeTextManager from "./badge-text-manager"
import MessageDispatcher from "./message-dispatcher"
import initLimitProcessor from "./limit-processor"
import initCsHandler from "./content-script-handler"
import { isBrowserUrl } from "@util/pattern"
import BackupScheduler from "./backup-scheduler"
import { listTabs } from "@api/chrome/tab"
import { isNoneWindowId, onNormalWindowFocusChanged } from "@api/chrome/window"
import initServer from "./timer/server"
import handleInstall from "./install-handler"

// Open the log of console
openLog()

const messageDispatcher = new MessageDispatcher()

// Limit processor
initLimitProcessor(messageDispatcher)

// Content-script's request handler
initCsHandler(messageDispatcher)

// Start server
initServer(messageDispatcher)

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

handleInstall()

// Start message dispatcher
messageDispatcher.start()

// Listen window focus changed
onNormalWindowFocusChanged(async windowId => {
    if (isNoneWindowId(windowId)) return
    const tabs = await listTabs({ windowId, active: true })
    tabs.filter(tab => !isBrowserUrl(tab?.url))
        .forEach(({ url, id }) => badgeTextManager.forceUpdate({ url, tabId: id }))
})
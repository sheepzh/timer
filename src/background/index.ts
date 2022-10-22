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
import MessageDispatcher from "./message-dispatcher"
import initLimitProcesser from "./limit-processor"
import initCsHandler from "./content-script-handler"

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

// Mange the context menus
WhitelistMenuManager()

// Browser action menu
BrowserActionMenuManager()

// Badge manager
badgeTextManager.init()

// Listen to tab active changed
new ActiveTabListener()
    .register(({ host }) => badgeTextManager.forceUpdate(host))
    .listen()

// Collect the install time
chrome.runtime.onInstalled.addListener(async detail => {
    detail.reason === "install" && await metaService.updateInstallTime(new Date())
    // Questionnaire for uninstall
    new UninstallListener().listen()
})

messageDispatcher.start()
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
import MessageListener from "./message-listener"
import Timer from "./timer"
import VersionManager from "./version-manager"
import ActiveTabListener from "./active-tab-listener"
import badgeTextManager from "./badge-text-manager"
import metaService from "@service/meta-service"
import UninstallListener from "./uninstall-listener"

// Open the log of console
openLog()

// Start the timer
new Timer().start()

// Collect the icon url and title
new IconAndAliasCollector().listen()

// Message listener
new MessageListener().listen()

// Process version
new VersionManager().init()

// Mange the context menus
WhitelistMenuManager()

// Browser action menu
chrome.runtime.onInstalled.addListener(_detail => BrowserActionMenuManager())

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
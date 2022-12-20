/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import WhitelistDatabase from "@db/whitelist-database"
import optionService from "@service/option-service"
import { t2Chrome } from "@i18n/chrome/t"
import { ContextMenusMessage } from "@i18n/message/common/context-menus"
import { extractHostname, isBrowserUrl } from "@util/pattern"

const db = new WhitelistDatabase(chrome.storage.local)

const menuId = '_timer_menu_item_' + Date.now()
let currentActiveId: number

let whitelist: string[] = []

let visible = true

const removeOrAdd = (removeOrAddFlag: boolean, host: string) => removeOrAddFlag ? db.remove(host) : db.add(host)

const menuInitialOptions: chrome.contextMenus.CreateProperties = {
    contexts: ['page', 'frame', 'selection', 'link', 'editable', 'image', 'video', 'audio'],
    id: menuId,
    checked: true,
    title: 'foobar',
    visible: false
}

function updateContextMenu(currentActiveTab: chrome.tabs.Tab | number) {
    if (typeof currentActiveTab === 'number') {
        // If number, get the tabInfo first
        chrome.tabs.get(currentActiveId, tab => tab && updateContextMenu(tab))
    } else {
        const tab = currentActiveTab as chrome.tabs.Tab
        const { url } = tab
        const targetHost = url && !isBrowserUrl(url) ? extractHostname(tab.url).host : ''
        const changeProp: chrome.contextMenus.UpdateProperties = {}
        if (!targetHost) {
            // If not a valid host, hide this menu
            changeProp.visible = false
        } else {
            // Else change the title
            const existsInWhitelist = whitelist.includes(targetHost)
            changeProp.visible = true && visible
            const titleMsgField: keyof ContextMenusMessage = existsInWhitelist ? 'removeFromWhitelist' : 'add2Whitelist'
            changeProp.title = t2Chrome(root => root.contextMenus[titleMsgField]).replace('{host}', targetHost)
            changeProp.onclick = () => removeOrAdd(existsInWhitelist, targetHost)
        }
        chrome.contextMenus.update(menuId, changeProp)
    }
}

const handleListChange = (newWhitelist: string[]) => {
    whitelist = newWhitelist
    updateContextMenu(currentActiveId)
}

const handleTabUpdated = (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: number | chrome.tabs.Tab) => {
    if (chrome.runtime.lastError) { /** prevent it from throwing error */ }
    // Current active tab updated
    tabId === currentActiveId
        && changeInfo.status === 'loading'
        && updateContextMenu(tab)
}

const handleTabActivated = (activeInfo: chrome.tabs.TabActiveInfo) => updateContextMenu(currentActiveId = activeInfo.tabId)

async function init() {
    chrome.contextMenus.create(menuInitialOptions)
    chrome.tabs.onUpdated.addListener(handleTabUpdated)
    chrome.tabs.onActivated.addListener(handleTabActivated)
    whitelist = await db.selectAll()
    db.addChangeListener(handleListChange)
    visible = (await optionService.getAllOption()).displayWhitelistMenu
    optionService.addOptionChangeListener(option => visible = option.displayWhitelistMenu)
}

export default init
/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { createContextMenu, updateContextMenu } from "@api/chrome/context-menu"
import { getRuntimeId } from "@api/chrome/runtime"
import { getTab, onTabActivated, onTabUpdated } from "@api/chrome/tab"
import WhitelistDatabase from "@db/whitelist-database"
import { t2Chrome } from "@i18n/chrome/t"
import { type ContextMenusMessage } from "@i18n/message/common/context-menus"
import optionHolder from "@service/components/option-holder"
import { extractHostname, isBrowserUrl } from "@util/pattern"

const db = new WhitelistDatabase(chrome.storage.local)

const menuId = '_timer_menu_item_' + getRuntimeId()
let currentActiveId: number

let whitelist: string[] = []

const removeOrAdd = (removeOrAddFlag: boolean, white: string) => removeOrAddFlag ? db.remove(white) : db.add(white)

const menuInitialOptions: ChromeContextMenuCreateProps = {
    contexts: ['page', 'frame', 'selection', 'link', 'editable', 'image', 'video', 'audio'],
    id: menuId,
    checked: true,
    title: 'foobar',
    visible: false
}

async function updateContextMenuInner(param: ChromeTab | number) {
    if (typeof param === 'number') {
        // If number, get the tabInfo first
        const tab: ChromeTab = await getTab(currentActiveId)
        tab && updateContextMenuInner(tab)
    } else {
        const { url } = param || {}
        const targetHost = url && !isBrowserUrl(url) ? extractHostname(url).host : ''
        const changeProp: ChromeContextMenuUpdateProps = {}
        if (!targetHost) {
            // If not a valid host, hide this menu
            changeProp.visible = false
        } else {
            // Else change the title
            const visible = (await optionHolder.get())?.displayWhitelistMenu
            const existsInWhitelist = whitelist.includes(targetHost)
            changeProp.visible = true && visible
            const titleMsgField: keyof ContextMenusMessage = existsInWhitelist ? 'removeFromWhitelist' : 'add2Whitelist'
            changeProp.title = t2Chrome(root => root.contextMenus[titleMsgField]).replace('{host}', targetHost)
            changeProp.onclick = () => removeOrAdd(existsInWhitelist, targetHost)
        }
        updateContextMenu(menuId, changeProp)
    }
}

const handleListChange = (newWhitelist: string[]) => {
    whitelist = newWhitelist
    updateContextMenuInner(currentActiveId)
}

const handleTabUpdated = (tabId: number, changeInfo: ChromeTabChangeInfo, tab: number | ChromeTab) => {
    // Current active tab updated
    tabId === currentActiveId
        && changeInfo.status === 'loading'
        && updateContextMenuInner(tab)
}

const handleTabActivated = (activeInfo: ChromeTabActiveInfo) => updateContextMenuInner(currentActiveId = activeInfo.tabId)

async function init() {
    createContextMenu(menuInitialOptions)
    onTabUpdated(handleTabUpdated)
    onTabActivated((_tabId, activeInfo) => handleTabActivated(activeInfo))
    db.addChangeListener(handleListChange)
}

export default init
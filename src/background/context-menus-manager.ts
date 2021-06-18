import WhitelistDatabase from '../database/whitelist-database'
import { t2Chrome } from '../util/i18n/chrome/t'
import { extractHostname, isBrowserUrl } from '../util/pattern'

const db = new WhitelistDatabase(chrome.storage.local)

const menuId = '_timer_menu_item_' + Date.now()

let whitelist: string[] = []

const whitelistSetter = (_whitelist: string[]) => whitelist = _whitelist

const removeOrAdd = (removeOrAddFlag: boolean, host: string) => removeOrAddFlag ? db.remove(host) : db.add(host)

class ContextMenusManager {
    private currentActiveId: number

    init() {
        db.selectAll().then(whitelistSetter)
        db.addChangeListener(_whitelist => {
            whitelistSetter(_whitelist)
            this.updateContextMenu(this.currentActiveId)
        })
        chrome.contextMenus.create(
            {
                contexts: ['page', 'frame', 'selection', 'link', 'editable', 'image', 'video', 'audio'],
                id: menuId,
                checked: true,
                title: 'foobar',
                visible: false
            }
        )
        chrome.tabs.onUpdated.addListener(
            (tabId, changeInfo, tab) =>
                // Current active tab updated
                tabId === this.currentActiveId
                && changeInfo.status === 'loading'
                && this.updateContextMenu(tab)
        )
        chrome.tabs.onActivated.addListener(activeInfo => {
            this.currentActiveId = activeInfo.tabId
            this.updateContextMenu(this.currentActiveId)
        })
    }

    /**
     * @param currentActiveTab tab info
     */
    private updateContextMenu(currentActiveTab: chrome.tabs.Tab | number) {
        if (typeof currentActiveTab === 'number') {
            // If number, get the tabInfo first
            chrome.tabs.get(this.currentActiveId, tab => tab && this.updateContextMenu(tab))
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
                changeProp.visible = true
                changeProp.title = (existsInWhitelist
                    ? t2Chrome(root => root.contextMenus.removeFromWhitelist)
                    : t2Chrome(root => root.contextMenus.add2Whitelist)).replace('{host}', targetHost)
                changeProp.onclick = () => removeOrAdd(existsInWhitelist, targetHost)
            }
            console.log(changeProp)
            chrome.contextMenus.update(menuId, changeProp)
        }
    }
}

export default ContextMenusManager
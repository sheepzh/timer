import { WHITELIST_KEY } from "./constant"


const ruleId = '_timer_whitelist_db_change_rule_id'

class WhitelistDatabase {

    private localStorage = chrome.storage.local

    constructor() { }

    private update(selectAll: string[]): Promise<void> {
        const obj = {}
        obj[WHITELIST_KEY] = selectAll
        return new Promise(resolve => this.localStorage.set(obj, resolve))
    }

    selectAll(): Promise<string[]> {
        return new Promise(resolve => this.localStorage.get(items => resolve(items[WHITELIST_KEY] || [])))
    }

    async add(url: string): Promise<void> {
        const selectAll = await this.selectAll()
        if (!selectAll.includes(url)) {
            selectAll.push(url)
            return this.update(selectAll)
        } else {
            return Promise.resolve()
        }
    }

    async remove(url: string): Promise<void> {
        const selectAll = await this.selectAll()
        const index = selectAll.indexOf(url)
        if (index !== -1) {
            selectAll.splice(index, 1)
            return this.update(selectAll)
        } else {
            return Promise.resolve()
        }
    }

    async includes(url: string): Promise<boolean> {
        const selectAll = await this.selectAll()
        return Promise.resolve(selectAll.includes(url))
    }

    /**
     * Add listener to listen changes
     * 
     * @since 0.1.9
     */
    addChangeListener(listener: (whitelist: string[]) => void) {
        const storageListener = (
            changes: { [key: string]: chrome.storage.StorageChange; },
            _areaName: "sync" | "local" | "managed"
        ) => {
            const changeInfo = changes[WHITELIST_KEY]
            changeInfo && listener(changeInfo.newValue || [])
        }
        chrome.storage.onChanged.addListener(storageListener)
    }
}

export default new WhitelistDatabase()
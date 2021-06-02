import { WHITELIST_KEY } from "./constant"

class WhitelistDatabase {

    private localStorage = chrome.storage.local

    constructor() { }

    private update(selectAll: string[]): Promise<void> {
        const obj = {}
        obj[WHITELIST_KEY] = selectAll
        return new Promise(resolve => this.localStorage.set(obj, resolve))
    }

    public selectAll(): Promise<string[]> {
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
}

export default new WhitelistDatabase()
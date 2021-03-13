import { WHITELIST_KEY } from "./constant"

class WhitelistDatabase {

    private localStorage = chrome.storage.local

    constructor() { }

    private update(selectAll: string[], callback?: () => void) {
        const obj = {}
        obj[WHITELIST_KEY] = selectAll
        this.localStorage.set(obj, callback)
    }

    public selectAll(callback: (selectAll: string[]) => void) {
        this.localStorage.get(items => callback(items[WHITELIST_KEY] || []))
    }

    public add(url: string, callback: () => void) {
        this.selectAll(selectAll => {
            if (!selectAll.includes(url)) {
                selectAll.push(url)
                this.update(selectAll, callback)
            } else {
                callback()
            }
        })
    }

    public remove(url: string, callback?: () => void) {
        this.selectAll(selectAll => {
            const index = selectAll.indexOf(url)
            if (index !== -1) {
                selectAll.splice(index, 1)
                this.update(selectAll, callback)
            } else {
                callback && callback()
            }
        })
    }

    public includes(url: string, callback: (includes: boolean) => void) {
        this.selectAll(selectAll => callback(selectAll.includes(url)))
    }
}

export default new WhitelistDatabase()
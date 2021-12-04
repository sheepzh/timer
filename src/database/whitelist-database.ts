/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import BaseDatabase from "./common/base-database"
import { WHITELIST_KEY } from "./common/constant"

class WhitelistDatabase extends BaseDatabase {

    private update(selectAll: string[]): Promise<void> {
        const obj = {}
        obj[WHITELIST_KEY] = selectAll
        return this.storage.set(obj)
    }

    async selectAll(): Promise<string[]> {
        const items = await this.storage.get(null)
        return Promise.resolve(items[WHITELIST_KEY] || [])
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
            changes: { [key: string]: chrome.storage.StorageChange },
            _areaName: "sync" | "local" | "managed"
        ) => {
            const changeInfo = changes[WHITELIST_KEY]
            changeInfo && listener(changeInfo.newValue || [])
        }
        chrome.storage.onChanged.addListener(storageListener)
    }

    async importData(data: any): Promise<void> {
        const toMigrate = data[WHITELIST_KEY]
        if (!Array.isArray(toMigrate)) return
        const exist = await this.selectAll()
        toMigrate.forEach(white => !exist.includes(white) && exist.push(white))
        this.update(exist)
    }
}

export default WhitelistDatabase
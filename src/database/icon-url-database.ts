/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import BaseDatabase from "./common/base-database"
import { REMAIN_WORD_PREFIX } from "./common/constant"

const DB_KEY_PREFIX = REMAIN_WORD_PREFIX + "ICON_URL"

const generateKey = (host: string) => DB_KEY_PREFIX + host

const urlOf = (key: string) => key.substring(DB_KEY_PREFIX.length)

const CHROME_FAVICON_PATTERN = /^(chrome|edge):\/\/favicon/

/**
 * The icon url of hosts
 * 
 * @since 0.1.7
 */
class IconUrlDatabase extends BaseDatabase {

    /**
     * Replace or insert
     * 
     * @param host host 
     * @param iconUrl icon url
     */
    put(host: string, iconUrl: string): Promise<void> {
        const toUpdate = {}
        toUpdate[generateKey(host)] = iconUrl
        return this.storage.set(toUpdate)
    }

    /**
     * @param hosts hosts
     */
    async get(...hosts: string[]): Promise<{ [host: string]: string }> {
        const keys = hosts.map(generateKey)
        const items = await this.storage.get(keys)
        const result = {}
        const keys2Remove = []
        Object.entries(items).forEach(([key, iconUrl]) => {
            if (CHROME_FAVICON_PATTERN.test(iconUrl)) {
                // Remove the icon url starting with chrome://favicon
                // Because this protocol is invalid since mv3 
                // And this will be removed in some version
                keys2Remove.push(key)
            } else {
                result[urlOf(key)] = iconUrl
            }
        })
        // Remove asynchronously
        keys2Remove.length && this.storage.remove(keys2Remove)
        return Promise.resolve(result)
    }

    async importData(data: any): Promise<void> {
        const items = await this.storage.get()
        const toSave = {}
        Object.entries(data)
            .filter(([key, value]) => key.startsWith(DB_KEY_PREFIX) && !!value && !items[key])
            .filter(([_key, value]) => !CHROME_FAVICON_PATTERN.test(value as string))
            .forEach(([key, value]) => toSave[key] = value)
        await this.storage.set(toSave)
    }
}

export default IconUrlDatabase
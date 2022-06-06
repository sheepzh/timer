/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { IS_FIREFOX } from "@util/constant/environment"
import BaseDatabase from "./common/base-database"
import { REMAIN_WORD_PREFIX } from "./common/constant"

const DB_KEY_PREFIX = REMAIN_WORD_PREFIX + "ICON_URL"

const generateKey = (host: string) => DB_KEY_PREFIX + host

const urlOf = (key: string) => key.substring(DB_KEY_PREFIX.length)

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
        Object.entries(items).forEach(([key, iconUrl]) => result[urlOf(key)] = iconUrl)
        return Promise.resolve(result)
    }

    async importData(data: any): Promise<void> {
        const items = await this.storage.get()
        const toSave = {}
        const chromeEdgeIconUrlReg = /^(chrome|edge):\/\/favicon/
        Object.entries(data)
            .filter(([key, value]) => key.startsWith(DB_KEY_PREFIX) && !!value && !items[key])
            .filter(([_key, value]) => !chromeEdgeIconUrlReg.test(value as string))
            .forEach(([key, value]) => toSave[key] = value)
        await this.storage.set(toSave)
    }
}

export default IconUrlDatabase
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

/**
 * The icon url of hosts
 * 
 * @since 0.1.7
 * @deprecated Use SiteDatabase
 */
class IconUrlDatabase extends BaseDatabase {

    async listAll(): Promise<{ [host: string]: string }> {
        const items = await this.storage.get()
        const result = {}
        Object.entries(items)
            .filter(([key]) => key.startsWith(DB_KEY_PREFIX))
            .forEach(([key, val]) => result[urlOf(key)] = val)
        return result
    }

    async remove(host: string): Promise<void> {
        const key = generateKey(host)
        await this.storage.remove(key)
    }

    async importData(data: any): Promise<void> {
        // Do nothing
    }
}

export default IconUrlDatabase
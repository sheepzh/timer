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
}

export default IconUrlDatabase
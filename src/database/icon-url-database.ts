import { REMAIN_WORD_PREFIX } from "./constant"

const DB_KEY_PREFIX = REMAIN_WORD_PREFIX + "ICON_URL"

const generateKey = (host: string) => DB_KEY_PREFIX + host

const urlOf = (key: string) => key.substring(DB_KEY_PREFIX.length)

/**
 * The icon url of hosts
 * 
 * @since 0.1.7
 */
class IconUrlDatabase {
    private localStorage = chrome.storage.local

    /**
     * Replace or insert
     * 
     * @param host host 
     * @param iconUrl icon url
     */
    put(host: string, iconUrl: string): Promise<void> {
        const toUpdate = {}
        toUpdate[generateKey(host)] = iconUrl
        return new Promise(resolve => this.localStorage.set(toUpdate, resolve))
    }

    /**
     * @param hosts hosts
     */
    get(...hosts: string[]): Promise<{ [host: string]: string }> {
        const keys = hosts.map(generateKey)
        return new Promise(resolve =>
            this.localStorage.get(keys,
                items => {
                    const result = {}
                    for (const [key, iconUrl] of Object.entries(items)) {
                        result[urlOf(key)] = iconUrl
                    }
                    resolve(result)
                }
            )
        )
    }
}

export default new IconUrlDatabase()
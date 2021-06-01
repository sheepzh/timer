import { log } from "../common/logger"
import whitelistDatabase from "../database/whitelist-database"

/**
 * Service of whitelist
 * 
 * @since 0.0.5
 */
class WhitelistService {

    public add(url: string, callback?: () => void) {
        log('add to whitelist: ' + url)
        // Just add to the white list, not to delete records since v0.1.1
        whitelistDatabase.add(url, () => callback && callback())
    }

    public listAll(callback: (whitelist: string[]) => void) {
        whitelistDatabase.selectAll(callback)
    }

    public remove(url: string, callback?: () => void) {
        whitelistDatabase.remove(url, callback)
    }

    /**
     * @since 0.0.7
     */
    public include(url: string, callback?: (including: boolean) => void) {
        whitelistDatabase.includes(url, callback)
    }
}

export default new WhitelistService()
/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { log } from "../common/logger"
import WhitelistDatabase from "../database/whitelist-database"

const whitelistDatabase = new WhitelistDatabase(chrome.storage.local)
/**
 * Service of whitelist
 * 
 * @since 0.0.5
 */
class WhitelistService {

    add(url: string): Promise<void> {
        log('add to whitelist: ' + url)
        // Just add to the white list, not to delete records since v0.1.1
        return whitelistDatabase.add(url)
    }

    listAll(): Promise<string[]> {
        return whitelistDatabase.selectAll()
    }

    remove(url: string): Promise<void> {
        log('remove whitelist: ' + url)
        return whitelistDatabase.remove(url)
    }

    /**
     * @since 0.0.7
     */
    include(url: string,): Promise<boolean> {
        return whitelistDatabase.includes(url)
    }
}

export default new WhitelistService()
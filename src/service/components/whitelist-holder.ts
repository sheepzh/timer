/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import WhitelistDatabase from "@db/whitelist-database"

const whitelistDatabase = new WhitelistDatabase(chrome.storage.local)

/**
 * The singleton implementation of whitelist holder 
 */
class WhitelistHolder {
    private whitelist: string[]

    constructor() {
        const whitelistSetter = (whitelist: string[]) => this.whitelist = whitelist
        whitelistDatabase.selectAll().then(whitelistSetter)
        whitelistDatabase.addChangeListener(whitelistSetter)
    }

    notContains(host: string): boolean {
        return !this.whitelist.includes(host)
    }
}

export default new WhitelistHolder()
/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import WhitelistDatabase from "@db/whitelist-database"
import { judgeVirtualFast } from "@util/pattern"
import { compileAntPattern } from "./virtual-site-holder"

const whitelistDatabase = new WhitelistDatabase(chrome.storage.local)

/**
 * The singleton implementation of whitelist holder
 */
class WhitelistHolder {
    private host: string[]
    private virtual: RegExp[]
    private postHandlers: (() => void)[]

    constructor() {
        whitelistDatabase.selectAll().then(list => this.setWhitelist(list))
        whitelistDatabase.addChangeListener((whitelist: string[]) => {
            this.setWhitelist(whitelist)
            this.postHandlers.forEach(handler => handler())
        })
        this.postHandlers = []
    }

    private setWhitelist(whitelist: string[]) {
        const host: string[] = []
        const virtual: RegExp[] = []
        whitelist?.forEach(white => {
            if (!white) return
            if (judgeVirtualFast(white)) {
                virtual.push(compileAntPattern(white))
            } else {
                host.push(white)
            }
        })
        this.host = host
        this.virtual = virtual
    }

    addPostHandler(handler: () => void) {
        this.postHandlers.push(handler)
    }

    contains(host: string, url: string): boolean {
        console.log(host, url, this.host, this.virtual?.[0])
        return this.host.includes(host) || this.virtual.some(r => r.test(url))
    }
}

export default new WhitelistHolder()
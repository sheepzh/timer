/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { getTab, onTabActivated } from "@api/chrome/tab"
import { extractHostname, HostInfo } from "@util/pattern"

type _Param = {
    url: string
    tabId: number
    host?: string
}

type _Handler = (params: _Param) => void

export default class ActiveTabListener {
    listener: _Handler[] = []

    private async processWithTabInfo({ url, id }: ChromeTab) {
        const hostInfo: HostInfo = extractHostname(url)
        const host: string = hostInfo.host
        const param: _Param = { url, tabId: id, host }
        this.listener.forEach(func => func(param))
    }

    register(handler: _Handler): ActiveTabListener {
        this.listener.push(handler)
        return this
    }

    listen() {
        onTabActivated(async tabId => {
            const tab = await getTab(tabId)
            tab && this.processWithTabInfo(tab)
        })
    }
}


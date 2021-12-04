/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import TimerContext, { TimeInfo } from "./context"

export default class CollectionContext {
    realInterval: number
    timerContext: TimerContext
    hostSet: Set<string>
    /**
     * The focus host while last collection
     */
    focusHost: string
    focusUrl: string

    init() {
        const now = Date.now()
        this.realInterval = now - this.timerContext.lastCollectTime
        this.timerContext.lastCollectTime = now
    }

    constructor() {
        this.timerContext = new TimerContext()
        this.hostSet = new Set()
        this.init()
    }

    collectHost(host: string) { this.hostSet.add(host) }

    resetFocus(focusHost: string, focusUrl: string) {
        this.focusHost = focusHost
        this.focusUrl = focusUrl
    }

    accumulateAll() {
        const interval = this.realInterval
        this.hostSet.forEach((host: string) => {
            const info = TimeInfo.of(interval, this.focusHost === host ? interval : 0)
            this.timerContext.accumulate(host, info)
        })
    }
}
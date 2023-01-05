/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import TimerContext from "./context"

export default class CollectionContext {
    realInterval: number
    timerContext: TimerContext


    init() {
        const now = Date.now()
        this.realInterval = now - this.timerContext.lastCollectTime
        this.timerContext.lastCollectTime = now
    }

    constructor() {
        this.timerContext = new TimerContext()
        this.init()
    }

    accumulate(focusHost: string, focusUrl: string) {
        this.timerContext.accumulate(focusHost, focusUrl, this.realInterval)
    }
}
/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { formatTime } from "@util/time"
import TimerContext from "./context"

function listen(context: TimerContext, newState: chrome.idle.IdleState) {
    console.log(`Idle state changed:${newState}`, formatTime(new Date()))
    context.setIdle(newState)
}

/**
 * @since 0.2.2
 */
export default class IdleListener {
    private context: TimerContext

    constructor(context: TimerContext) {
        this.context = context
    }

    listen() {
        chrome.idle.onStateChanged.addListener(newState => listen(this.context, newState))
    }
}
/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { IS_SAFARI } from "@util/constant/environment"
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
        if (!IS_SAFARI) {
            // Idle does not work in macOs
            chrome.idle.onStateChanged.addListener(newState => listen(this.context, newState))
        }
    }
}
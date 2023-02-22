/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { onIdleStateChanged } from "@api/chrome/idle"
import { IS_SAFARI } from "@util/constant/environment"
import { formatTime } from "@util/time"
import TimerContext from "./context"

function listen(context: TimerContext, newState: ChromeIdleState) {
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
        // Idle does not work in Safari
        !IS_SAFARI && onIdleStateChanged(newState => listen(this.context, newState))
    }
}
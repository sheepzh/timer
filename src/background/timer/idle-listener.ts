import { formatTime } from "../../util/time"
import TimerContext from "./context"

function listen(context: TimerContext, newState: chrome.idle.IdleState) {
    if (newState === 'active') {
        context.resume()
    } else if (newState === 'locked') {
        // If locked then pause
        context.pause()
    } else if (newState === 'idle') {
        // do nothing
    }
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
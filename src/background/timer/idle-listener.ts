import TimerContext from "./context"

function listen(context: TimerContext, newState: chrome.idle.IdleState) {
    if (newState !== 'active') {
        // If not active then pause
        context.pause()
    } else {
        // Or resume
        context.resume()
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
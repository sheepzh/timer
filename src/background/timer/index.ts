import collect from "./collect"
import save from "./save"
import TimerContext from "./timer-context"

/**
 * Timer
 */
class Timer {
    private context: TimerContext = new TimerContext()

    start() {
        setInterval(() => collect(this.context), 555)
        setInterval(() => save(this.context), 2048)
    }
}

export default Timer
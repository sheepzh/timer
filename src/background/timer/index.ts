import TimeCollector from "./collector"
import IdleListener from "./idle-listener"
import save from "./save"
import TimerContext from "./context"

/**
 * Timer
 */
class Timer {
    private context: TimerContext

    constructor() {
        this.context = new TimerContext()
    }

    start() {
        new IdleListener(this.context).listen()
        const collector = new TimeCollector(this.context)

        setInterval(() => collector.collect(), 555)
        setInterval(() => save(this.context), 2048)
    }
}

export default Timer
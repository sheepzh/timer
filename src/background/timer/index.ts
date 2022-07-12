/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import TimeCollector from "./collector"
import IdleListener from "./idle-listener"
import save from "./save"
import TimerContext from "./context"
import CollectionContext from "./collection-context"

/**
 * Timer
 */
class Timer {
    start() {
        const collectionContext = new CollectionContext()
        const timerContext: TimerContext = collectionContext.timerContext
        new IdleListener(timerContext).listen()
        const collector = new TimeCollector(collectionContext)

        setInterval(() => collector.collect(), 1000)
        setInterval(() => save(collectionContext), 500)
    }
}

export default Timer

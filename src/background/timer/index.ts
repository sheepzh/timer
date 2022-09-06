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

function createAlarm(name: string, interval: number, beforeAction?: () => void) {
    beforeAction?.()
    chrome.alarms.create(name, { when: Date.now() + interval })
}

/**
 * Timer
 */
class Timer {
    start() {
        const collectionContext = new CollectionContext()
        const timerContext: TimerContext = collectionContext.timerContext
        new IdleListener(timerContext).listen()
        const collector = new TimeCollector(collectionContext)

        const collectAlarmName = 'timer-collect-alarm'
        const saveAlarmName = 'timer-save-alarm'
        createAlarm(collectAlarmName, 1000)
        createAlarm(saveAlarmName, 500)
        chrome.alarms.onAlarm.addListener(alarm => {
            if (collectAlarmName === alarm.name) {
                createAlarm(collectAlarmName, 1000, () => {
                    collector.collect()
                    chrome.alarms.clear(collectAlarmName)
                })
            } else if (saveAlarmName === alarm.name) {
                createAlarm(saveAlarmName, 500, () => {
                    save(collectionContext)
                    chrome.alarms.clear(saveAlarmName)
                })
            }
        })
    }
}

export default Timer

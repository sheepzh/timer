/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import optionService from "@service/option-service"

let countWhenIdle: boolean = false

const setCountWhenIdle = (op: timer.option.AllOption) => countWhenIdle = op.countWhenIdle
optionService.getAllOption().then(setCountWhenIdle)
optionService.addOptionChangeListener(setCountWhenIdle)

/**
 * Context of timer
 */
export default class TimerContext {
    /**
     * The result of time collection 
     */
    timeMap: { [host: string]: TimeInfo }
    /**
     * The last collect time
     */
    lastCollectTime: number

    private idleState: chrome.idle.IdleState

    constructor() {
        this.idleState = 'active'
        this.lastCollectTime = new Date().getTime()
        this.resetTimeMap()
    }

    accumulate(host: string, url: string, focusTime: number) {
        let data: TimeInfo = this.timeMap[host]
        !data && (this.timeMap[host] = data = {})
        let existFocusTime = data[url] || 0
        data[url] = existFocusTime + focusTime
    }

    /**
     * Reset the time map
     */
    resetTimeMap(): void { this.timeMap = {} }

    setIdle(idleNow: chrome.idle.IdleState) { this.idleState = idleNow }

    isPaused(): boolean {
        if (this.idleState === 'active') {
            return false
        } else if (this.idleState === 'locked') {
            return true
        } else if (this.idleState === 'idle') {
            return !countWhenIdle
        }
        // Never happen
        return false
    }
}
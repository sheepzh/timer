/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import optionService from "@service/option-service"

export class TimeInfo {
    focus: number
    run: number

    static zero() {
        return this.of(0, 0)
    }

    static of(run: number, focus?: number): TimeInfo {
        const info = new TimeInfo()
        info.run = run || 0
        info.focus = focus || 0
        return info
    }

    selfIncrease(another: TimeInfo): void {
        this.focus += another.focus
        this.run += another.run
    }
}

let countWhenIdle: boolean = false

const setCountWhenIdle = (op: Timer.Option) => countWhenIdle = op.countWhenIdle
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

    accumulate(host: string, timeInfo: TimeInfo) {
        let data = this.timeMap[host]
        !data && (this.timeMap[host] = data = TimeInfo.zero())
        data.selfIncrease(timeInfo)
    }

    /**
     * Reset the time map
     */
    resetTimeMap(): void { this.timeMap = {} }

    /**
     * @returns The focus info
     */
    findFocus(): [host: string, timeInfo: TimeInfo] | undefined {
        return Object.entries(this.timeMap).find(([_host, { focus }]) => focus)
    }

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
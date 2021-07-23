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
    /**
     * Whether to time
     */
    private timing: boolean

    constructor() {
        this.timing = true
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

    /**
     * Pause timing
     */
    pause() { this.timing = false }
    /**
     * Resume timing
     */
    resume() { this.timing = true }

    isPaused(): boolean { return !this.timing }
}
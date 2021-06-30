type TimeInfo = {
    focus: number
    run: number
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
     * The focust host while last collection
     */
    focusHost: string

    constructor() {
        this.lastCollectTime = new Date().getTime()
        this.resetTimeMap()
    }

    /**
     * Reset the timemap
     */
    resetTimeMap(): void {
        this.timeMap = {}
    }

    /**
     * @returns The focus info
     */
    findFocus(): [host: string, timeInfo: TimeInfo] {
        const result = Object.entries(this.timeMap).find(([_host, { focus }]) => focus)
        return result
    }
}
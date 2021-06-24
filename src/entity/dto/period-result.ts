import { MILLS_PER_PERIOD, MINUTES_PER_PERIOD, PeriodKey } from "./period-info"

export default class PeriodResult {
    /**
     * {yyyy}{mm}{dd}
     */
    date: string
    startTime: Date
    endTime: Date
    /**
     * 1 - 60000
     * ps. 60000 = 60s * 1000ms/s
     */
    millseconds: number

    static of(end: PeriodKey, duration?: number, millseconds?: number) {
        duration = duration || 1
        millseconds = millseconds || 0
        const result: PeriodResult = new PeriodResult()
        result.date = end.getDateString()
        const endStart = end.getStart()
        result.endTime = new Date(endStart.getTime() + MILLS_PER_PERIOD)
        result.startTime = duration === 1 ? endStart : new Date(endStart.getTime() - (duration - 1) * MILLS_PER_PERIOD)
        result.millseconds = millseconds
        return result
    }

    public getStartOrder() {
        return (this.startTime.getHours() * 60 + this.startTime.getMinutes()) / MINUTES_PER_PERIOD
    }
}

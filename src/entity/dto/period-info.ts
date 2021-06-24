import { MILL_PER_DAY } from "../../util/time"

export const MILL_PER_MINUTE = 1000 * 60

export const MINUTES_PER_PERIOD = 15

export const PERIODS_PER_DATE = 24 * 60 / MINUTES_PER_PERIOD

export const MAX_PERIOD_ORDER = PERIODS_PER_DATE - 1

export const MILLS_PER_PERIOD = MINUTES_PER_PERIOD * 60 * 1000

export class PeriodKey {
    year: number
    month: number
    date: number
    /**
     * 0~95
     * ps. 95 = 60 / 15 * 24 - 1
     */
    order: number

    private _id: number

    static of(time: Date | number, order?: number): PeriodKey {
        const date = time instanceof Date ? time : new Date(time)
        const result = new PeriodKey()
        result.year = date.getFullYear()
        result.month = date.getMonth() + 1
        result.date = date.getDate()
        order = order === undefined
            ? date.getHours() * 4 + Math.floor(date.getMinutes() / MINUTES_PER_PERIOD)
            : order
        // YEAR 16 BIT, MONTH 4 BIT, DATE 6 BIT, ORDER 8 BIT
        result._id = (result.year << 18)
            | (result.month << 14)
            | (result.date << 8)
            | order
        result.order = order
        return result
    }

    static with(old: PeriodKey, newOrder: number) {
        const result = new PeriodKey()
        Object.assign(result, old)
        result.order = newOrder
        return result
    }

    public compare(another: PeriodKey) {
        return this._id - another._id
    }

    public before(orderCount: number) {
        let order = this.order
        let decomposition = 0

        while (order < orderCount) {
            decomposition++
            order += PERIODS_PER_DATE
        }
        order = order - orderCount
        if (decomposition) {
            const newDate = new Date(this.getStart().getTime() - MILL_PER_DAY * decomposition)
            return PeriodKey.of(newDate, order)
        } else {
            return PeriodKey.with(this, order)
        }
    }

    public after(orderCount: number) {
        const date = new Date(this.year, this.month - 1, this.date, 0, (this.order + orderCount) * MINUTES_PER_PERIOD, 1)
        return PeriodKey.of(date)
    }

    public getStart(): Date {
        return new Date(this.year, this.month - 1, this.date, 0, MINUTES_PER_PERIOD * this.order)
    }

    public produce(millseconds: number): PeriodInfo {
        const result: PeriodInfo = new PeriodInfo()
        Object.assign(result, this)
        result.millseconds = millseconds
        return result
    }

    public lastOfLastDate() {
        return this.before(this.order + 1)
    }

    public mapKey() {
        return this._id
    }

    public getDateString() {
        return `${this.year}${this.month < 10 ? '0' : ''}${this.month}${this.date < 10 ? '0' : ''}${this.date}`
    }

    public getMinuteOfDate() {
        return this.order * MINUTES_PER_PERIOD
    }
}

export default class PeriodInfo extends PeriodKey {
    /**
     * 1~900000
     * ps. 900000 = 15min * 60s/min * 1000ms/s
     */
    millseconds: number
}
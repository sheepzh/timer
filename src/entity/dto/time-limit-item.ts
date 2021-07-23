export default class TimeLimitItem {
    /**
     * Condition, can be regular expression with star signs
     */
    cond: string
    regular: RegExp
    /**
     * Time limit, seconds
     */
    time: number
    enabled: boolean
    /**
     * Waste today, milliseconds
     */
    waste?: number

    static of(cond: string, time: number, enabled?: boolean, waste?: number) {
        const result = new TimeLimitItem()
        result.cond = cond
        result.regular = new RegExp(`^${cond.split('*').join('.*')}`)
        result.time = time
        result.enabled = enabled === undefined ? true : enabled
        result.waste = waste || 0
        return result
    }

    matches(url: string) {
        return this.regular.test(url)
    }

    hasLimited() {
        return this.waste >= this.time * 1000
    }
}
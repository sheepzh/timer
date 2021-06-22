
type PeriodInfo = {
    /**
     * {yyyy}{mm}{dd}
     */
    date: string
    /**
     * 0 - 1439
     * ps. 1439 = 60min/h * 24h - 1min
     */
    minuteOrder: number
    /**
     * 1 - 60000
     * ps. 60000 = 60s * 1000ms/s
     */
    millseconds: number
}

export default PeriodInfo
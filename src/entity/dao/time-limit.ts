export type TimeLimit = {
    /**
     * Condition, can be regular expression with star signs
     */
    cond: string
    /**
     * Time limit, seconds
     */
    time: number
    enabled: boolean
}

export type TimeLimitInfo = TimeLimit & {
    /**
     * The latest record date
     */
    latestDate: string
    /**
     * Time wasted in the latest record date
     */
    wasteTime: number
}

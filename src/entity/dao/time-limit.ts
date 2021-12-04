/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

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
    /**
     * Allow to delay 5 minutes if time over
     */
    allowDelay: boolean
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

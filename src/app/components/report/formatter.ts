/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { MILL_PER_MINUTE } from "@entity/dto/period-info"
import { formatPeriodCommon } from "@util/time"

/**
 * @param date date string {yyyy}{mm}{dd}
 * @returns the msg 
 */
export function dateFormatter(date: string): string {
    const y = date.substring(0, 4)
    const m = date.substring(4, 6)
    const d = date.substring(6, 8)
    if (!y || !m || !d) {
        return '-'
    }
    return t(msg => msg.calendar.dateFormat, { y, m, d })
}

/**
 * @param milliseconds 
 * @param timeFormat 
 * @param hideUnit 
 */
export const periodFormatter = (milliseconds: number, timeFormat?: timer.app.TimeFormat, hideUnit?: boolean) => {
    const format = timeFormat || "default"
    if (milliseconds === undefined) {
        if (format === 'default') {
            return '-'
        } else {
            milliseconds = 0
        }
    }
    if (format === "default") {
        return formatPeriodCommon(milliseconds)
    } else if (format === "second") {
        const second = Math.floor(milliseconds / 1000)
        return second + (hideUnit ? '' : ' s')
    } else if (format === "minute") {
        const minute = (milliseconds / MILL_PER_MINUTE).toFixed(1)
        return minute + (hideUnit ? '' : ' m')
    } else if (format === "hour") {
        const hour = (milliseconds / (MILL_PER_MINUTE * 60)).toFixed(2)
        return hour + (hideUnit ? '' : ' h')
    }
    return '-'
}

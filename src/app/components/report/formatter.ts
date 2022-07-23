/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
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
 * @param displayBySecond 
 * @param hideUnitOfSecond 
 */
export const periodFormatter = (milliseconds: number, displayBySecond?: boolean, hideUnitOfSecond?: boolean) => {
    if (milliseconds === undefined) return displayBySecond ? '0' : '-'
    const second = Math.floor(milliseconds / 1000)
    return displayBySecond ? (second + (hideUnitOfSecond ? '' : ' s')) : formatPeriodCommon(milliseconds)
}

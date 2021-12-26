/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { formatPeriodCommon } from "@util/time"

/**
 * @param date date string {yyyy}{mm}{dd}
 * @returns the msg 
 */
export const dateFormatter = (date: string) => date ? date.substring(0, 4) + '/' + date.substring(4, 6) + '/' + date.substring(6, 8) : '-'

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
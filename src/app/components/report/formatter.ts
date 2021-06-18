import { formatPeriodCommon } from "../../../util/time"

/**
 * @param date date string {yyyy}{mm}{dd}
 * @returns the msg 
 */
export const dateFormatter = (date: string) => date ? date.substring(0, 4) + '/' + date.substring(4, 6) + '/' + date.substring(6, 8) : '-'

/**
 * @param millseconds 
 * @param displayBySecond 
 * @param hideUnitOfSecond 
 */
export const periodFormatter = (millseconds: number, displayBySecond?: boolean, hideUnitOfSecond?: boolean) => {
    if (millseconds === undefined) return displayBySecond ? '0' : '-'
    const second = Math.floor(millseconds / 1000)
    return displayBySecond ? (second + (hideUnitOfSecond ? '' : ' s')) : formatPeriodCommon(millseconds)
}
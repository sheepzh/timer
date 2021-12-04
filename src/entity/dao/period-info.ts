/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

/**
 * The focus period of one day
 * 
 * @since v0.2.1
 */
type FocusPerDay = {
    /**
     * order => milliseconds of focus 
     */
    [minuteOrder: number]: number
}

export default FocusPerDay
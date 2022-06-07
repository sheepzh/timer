/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

/**
 * Time waste per day. Reconstructed at v0.0.9
 * 
 * @since 0.0.1
 */
export default class WastePerDay {
    /**
     * Duration of visit
     */
    total: number
    /**
     * Duration of focus
     */
    focus: number
    /**
     * Visit times
     */
    time: number

    constructor() {
        this.total = 0
        this.focus = 0
        this.time = 0
    }

    isNotZero(): boolean {
        return !!this.total || !!this.focus || !!this.time
    }

    static of(total: number, focus: number, time: number) {
        const result: WastePerDay = new WastePerDay()
        result.total = total
        result.focus = focus
        result.time = time
        return result
    }

    static zero() {
        return new WastePerDay()
    }
}

export function merge(a: WastePerDay, b: WastePerDay) {
    return WastePerDay.of(a.total + b.total, a.focus + b.focus, a.time + b.time)
}

/**
 * Waste data
 * 
 * @since 0.3.3
 */
export type WasteData = { [host: string]: WastePerDay }
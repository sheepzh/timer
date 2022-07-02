/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

export function isNotZero(target: timer.stat.WastePerDay): boolean {
    return !!target.total || !!target.focus || !!target.time
}

export function zero(): timer.stat.WastePerDay {
    return { focus: 0, time: 0, total: 0 }
}

export function merge(a: timer.stat.WastePerDay, b: timer.stat.WastePerDay): timer.stat.WastePerDay {
    return { total: a.total + b.total, focus: a.focus + b.focus, time: a.time + b.time }
}

export function wasteOf(total: number, focus: number, time: number): timer.stat.WastePerDay {
    return { total, focus, time }
}
/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

export function isNotZeroResult(target: timer.stat.Result): boolean {
    return !!target.total || !!target.focus || !!target.time
}

export function createZeroResult(): timer.stat.Result {
    return { focus: 0, time: 0, total: 0 }
}

export function mergeResult(a: timer.stat.Result, b: timer.stat.Result): timer.stat.Result {
    return { total: a.total + b.total, focus: a.focus + b.focus, time: a.time + b.time }
}

export function resultOf(total: number, focus: number, time: number): timer.stat.Result {
    return { total, focus, time }
}

export function rowOf(key: timer.stat.RowKey, item?: timer.stat.Result): timer.stat.Row {
    return {
        host: key.host,
        date: key.date,
        total: item && item.total || 0,
        focus: item && item.focus || 0,
        time: item && item.time || 0,
        mergedHosts: []
    }
}

export const ALL_DIMENSIONS: timer.stat.Dimension[] = ['focus', 'time']

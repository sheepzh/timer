import { identifySiteKey } from "./site"

/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
export function isNotZeroResult(target: timer.core.Result): boolean {
    return !!target.focus || !!target.time
}

export function createZeroResult(): timer.core.Result {
    return { focus: 0, time: 0 }
}

export function mergeResult(a: timer.core.Result, b: timer.core.Result): timer.core.Result {
    return {
        focus: (a?.focus ?? 0) + (b?.focus ?? 0),
        time: (a?.time ?? 0) + (b?.time ?? 0),
    }
}

export function resultOf(focus: number, time: number): timer.core.Result {
    return { focus, time }
}

export const ALL_DIMENSIONS: timer.core.Dimension[] = ['focus', 'time']

export function identifyStatKey(rowKey: timer.stat.StatKey) {
    const { siteKey, date, cateKey } = rowKey || {}
    return [date ?? '', identifySiteKey(siteKey), cateKey ?? ''].join('_')
}
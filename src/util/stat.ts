/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { judgeVirtualFast } from "./pattern"

export function isNotZeroResult(target: timer.stat.Result): boolean {
    return !!target.focus || !!target.time
}

export function createZeroResult(): timer.stat.Result {
    return { focus: 0, time: 0 }
}

export function mergeResult(a: timer.stat.Result, b: timer.stat.Result): timer.stat.Result {
    return {
        focus: (a?.focus ?? 0) + (b?.focus ?? 0),
        time: (a?.time ?? 0) + (b?.time ?? 0),
    }
}

export function resultOf(focus: number, time: number): timer.stat.Result {
    return { focus, time }
}

export const ALL_DIMENSIONS: timer.stat.Dimension[] = ['focus', 'time']

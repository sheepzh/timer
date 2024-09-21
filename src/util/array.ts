/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

/**
 * Group by
 *
 * @param arr original array
 * @param keyFunc key generator
 * @returns grouped map
 * @since 1.0.0
 */
export function groupBy<T, R>(
    arr: T[],
    keyFunc: (e: T, idx: number) => string | number,
    downstream: (grouped: T[], key: string) => R
): { [key: string]: R } {
    const groupedMap: { [key: string]: T[] } = {}
    arr.forEach((e, idx) => {
        const key = keyFunc(e, idx)
        if (key === undefined || key === null) {
            return
        }
        const existArr: T[] = groupedMap[key] || []
        existArr.push(e)
        groupedMap[key] = existArr
    })
    const result = {}
    Object.entries(groupedMap)
        .forEach(([key, grouped]) => result[key] = downstream(grouped, key))
    return result
}

/**
 * Rotate the array without new one returned
 *
 * @param arr the targe array
 * @param count count to rotate, must be positive, or 1 is default
 * @param rightOrLeft rotate right or left, true means left, false means right, default is false
 */
export function rotate<T>(arr: T[], count?: number, rightOrLeft?: boolean): void {
    let realTime = 1
    if (count && count > 1) {
        realTime = count
    }
    const operation = !!rightOrLeft
        // Right
        ? (a: T[]) => a.unshift(a.pop())
        // Left
        : (a: T[]) => a.push(a.shift())
    for (; realTime > 0; realTime--) {
        operation(arr)
    }
}

/**
 * Summarize
 *
 * @param arr target arr
 */
export function sum(arr: number[]): number {
    return arr?.reduce?.((a, b) => (a || 0) + (b || 0), 0) ?? 0
}

/**
 * @since 2.1.0
 * @returns null if arr is empty or null
 */
export function average(arr: number[]): number {
    if (!arr?.length) return null
    return sum(arr) / arr.length
}

export function allMatch<T>(arr: T[], predicate: (t: T) => boolean): boolean {
    return !arr?.filter?.(e => !predicate?.(e))?.length
}

export function anyMatch<T>(arr: T[], predicate: (t: T) => boolean): boolean {
    return !!arr?.filter?.(e => predicate?.(e))?.length
}

export function range(len: number): number[] {
    const arr = []
    for (let i = 0; i < len; i++) {
        arr.push(i)
    }
    return arr
}
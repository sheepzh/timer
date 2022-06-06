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
    keyFunc: (e: T) => string | number,
    downstream: (grouped: T[]) => R
): { [key: string]: R } {
    const groupedMap: { [key: string]: T[] } = {}
    arr.forEach(e => {
        const key = keyFunc(e)
        const existArr: T[] = groupedMap[key] || []
        existArr.push(e)
        groupedMap[key] = existArr
    })
    const result = {}
    Object.entries(groupedMap)
        .forEach(([key, grouped]) => result[key] = downstream(grouped))
    return result
}

/**
 * Rotate the array without new one returned
 * 
 * @param arr the targe array
 * @param count count to rotate, must be positive, or 1 is default 
 * @param leftOrRight rotate right or left, true means left, false means right, default is false
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
    return arr?.reduce?.((a, b) => (a || 0) + (b || 0), 0) || 0
}
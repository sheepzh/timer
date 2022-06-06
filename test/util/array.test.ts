/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { groupBy, rotate } from "@util/array"

test('group by', () => {
    const arr = [
        [1, 2],
        [1, 3],
        [2, 3],
        [3, 4],
        [2, 9]
    ]
    // Find the max value of each group
    const maxMap = groupBy(arr, a => a[0], arr => Math.max(...arr.map(a => a[1])))
    expect(maxMap).toEqual({
        1: 3,
        2: 9,
        3: 4
    })
    const allVal = groupBy(arr, _ => undefined, arr => arr.map(a => a[1]))
    expect(allVal).toEqual({ undefined: [2, 3, 3, 4, 9] })
})

test("rotate", () => {
    const arr = [1, 2, 3, 4, 5, 6]
    // Left rotate for 1 time
    rotate(arr)
    expect(arr).toEqual([2, 3, 4, 5, 6, 1])
    // Left rotate again for 2 times
    rotate(arr, 2, false)
    expect(arr).toEqual([4, 5, 6, 1, 2, 3])
    // Right rotate for 3 times
    rotate(arr, 3, true)
    expect(arr).toEqual([1, 2, 3, 4, 5, 6])
})
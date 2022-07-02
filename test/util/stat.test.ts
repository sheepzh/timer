import { mergeResult, resultOf, createZeroResult } from "@util/stat"

test('default values of WastePerDay', () => {
    const newOne = createZeroResult()
    expect(newOne.time).toBe(0)
    expect(newOne.focus).toBe(0)
    expect(newOne.total).toBe(0)

    const another = mergeResult(newOne, resultOf(1, 1, 2))
    expect(another).toEqual(resultOf(1, 1, 2))
})
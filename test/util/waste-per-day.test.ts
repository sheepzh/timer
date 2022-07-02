import { merge, wasteOf, zero } from "@util/waste-per-day"

test('default values of WastePerDay', () => {
    const newOne = zero()
    expect(newOne.time).toBe(0)
    expect(newOne.focus).toBe(0)
    expect(newOne.total).toBe(0)

    const another = merge(newOne, wasteOf(1, 1, 2))
    expect(another).toEqual(wasteOf(1, 1, 2))
})
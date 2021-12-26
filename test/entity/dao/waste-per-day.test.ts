import WastePerDay, { merge } from "@entity/dao/waste-per-day"

test('default values of WastePerDay', () => {
    const newOne = new WastePerDay()
    expect(newOne.time).toBe(0)
    expect(newOne.focus).toBe(0)
    expect(newOne.total).toBe(0)

    const another = merge(newOne, WastePerDay.of(1, 1, 2))
    expect(another).toEqual(WastePerDay.of(1, 1, 2))
})
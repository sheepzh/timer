import WastePerDay from "../../../src/entity/dao/waste-per-day"

test('default values of WastePerDay', () => {
    const newOne = new WastePerDay()
    expect(newOne.time).toBe(0)
    expect(newOne.focus).toBe(0)
    expect(newOne.total).toBe(0)
})
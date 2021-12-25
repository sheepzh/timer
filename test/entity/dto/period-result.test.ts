import { PeriodKey } from "../../../src/entity/dto/period-info"

test('compare', () => {
    const a = PeriodKey.of(new Date(2020, 4, 20), 15)
    const b = PeriodKey.of(new Date(2020, 4, 20), 19)
    expect(a.compare(b) < 0).toEqual(true)
})
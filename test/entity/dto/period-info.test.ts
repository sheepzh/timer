import PeriodInfo, { PeriodKey } from "../../../src/entity/dto/period-info"

test('with', () => {
    const key1 = PeriodKey.of(new Date(), 0)
    const key2 = PeriodKey.with(key1, 1)

    expect(key1.compare(key2) < 0).toBeTruthy()
    expect(key1.compare(key1) === 0).toBeTruthy()
})
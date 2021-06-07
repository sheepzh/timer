import { formatPeriod, formatPeriodCommon, formatTime } from "../../src/util/time"

test('time', () => {
    const dateStr = '2020/05/01 00:00:01'
    const date = Date.parse(dateStr)
    const format = '{y}{m}{d} {h}{i}{s}{a}'
    const result = '20200501 000001五'

    // default format
    expect(formatTime(dateStr)).toEqual('2020-05-01 00:00:01')

    expect(formatTime(dateStr, format)).toEqual(result)

    expect(formatTime(date, format)).toEqual(result)
    // use seconds
    expect(formatTime(Math.floor(date / 1000), format)).toEqual(result)

    // use string
    expect(formatTime(date.toString(), format)).toEqual(result)
    expect(formatTime(Math.floor(date / 1000).toString(), format)).toEqual(result)

    expect(formatTime(new Date(date), format)).toEqual(result)
})

test('time', () => {
    expect(formatPeriod(3666 * 1000, '{hour}时{minute}分{second}秒', '{minute}分{second}秒', '{second}秒')).toEqual('1时1分6秒')
    expect(formatPeriodCommon(3666 * 1000)).toEqual('1 h 1 m 6 s')
    expect(formatPeriodCommon(1)).toEqual('0 s')
})

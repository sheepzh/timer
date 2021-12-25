import { daysAgo, formatPeriod, formatPeriodCommon, formatTime } from "@util/time"

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
    const msg = {
        hourMsg: '{hour}时{minute}分{second}秒',
        minuteMsg: '{minute}分{second}秒',
        secondMsg: '{second}秒'
    }
    expect(formatPeriod(3666 * 1000, msg)).toEqual('1时1分6秒')
    expect(formatPeriodCommon(3666 * 1000)).toEqual('1 h 1 m 6 s')
    expect(formatPeriodCommon(1)).toEqual('0 s')
})

test('time', () => {
    const start = Math.floor(Math.random() * 100)
    const range = daysAgo(start + 2, start)
    expect(range[1].getTime() - range[0].getTime()).toEqual(1000/*ms/s*/ * 60/*s/min*/ * 60/*min/h*/ * 24/*h/day*/ * 2/*day*/)
})
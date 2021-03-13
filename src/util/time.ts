/**
 * Parse the time to string
 */
export function formatTime(time: Date | string | number, cFormat: string) {
    if (arguments.length === 0 || !time) {
        return null
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
        date = time
    } else {
        if ((typeof time === 'string')) {
            if ((/^[0-9]+$/.test(time))) {
                // support "1548221490638"
                time = parseInt(time)
            } else {
                // support safari
                time = time.replace(new RegExp(/-/gm), '/')
            }
        }

        if ((typeof time === 'number') && (time.toString().length === 10)) {
            time = time * 1000
        }
        date = new Date(time)
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    }
    const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
        const value = formatObj[key]
        // Note: getDay() returns 0 on Sunday
        if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
        return value.toString().padStart(2, '0')
    })
    return time_str
}

/**
 * Format millseconds for display
 */
export function formatPeriod(milliseconds: number, hourMsg: string, minuteMsg: string, secondMsg: string): string {
    const seconds = Math.floor(milliseconds / 1000)
    const hour = Math.floor(seconds / 3600)
    const minute = Math.floor(seconds / 60 - hour * 60)
    const second = seconds - hour * 3600 - minute * 60

    let msg = hourMsg
    hour === 0 && (msg = minuteMsg) && minute === 0 && (msg = secondMsg)
    return msg.replace('{hour}', hour.toString()).replace('{minute}', minute.toString()).replace('{second}', second.toString())
}

/**
 * e.g. 
 * 
 * 100h0m0s
 * 20h10m59s
 * 20h0m1s
 * 10m20s
 * 30s
 * 
 * @return (xx+h)(xx+m)xx+s
 */
export function formatPeriodCommon(milliseconds: number): string {
    return formatPeriod(milliseconds, '{hour} h {minute} m {second}s', '{minute} m {second} s', '{second} s')
}

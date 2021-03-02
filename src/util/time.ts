/**
 * Format date 2 YYYYMMDD
 * 
 * @param date 
 * @return YYYYMMDD
 */
export function format(date: Date): string {
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let day = date.getDate();
    return `${year}${month < 10 ? ('0' + month) : month}${day < 10 ? ('0' + day) : day}`
}

/**
 * Format date for display
 * 
 * @param date 
 */
export function formatSpec(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000)
    const hour = Math.floor(seconds / 3600)
    const minute = Math.floor(seconds / 60 - hour * 60)
    const second = seconds - hour * 3600 - minute * 60

    const hourMsg = chrome.i18n.getMessage('message_timeWithHour')
    const minuteMsg = chrome.i18n.getMessage('message_timeWithMinute')
    const secondMsg = chrome.i18n.getMessage('message_timeWithSecond')


    let msg = hourMsg
    hour === 0 && (msg = minuteMsg) && minute === 0 && (msg = secondMsg)
    return msg.replace('{hour}', hour.toString()).replace('{minute}', minute.toString()).replace('{second}', second.toString())
}


export function formatSpec1(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000)
    const hour = Math.floor(seconds / 3600)
    const minute = Math.floor(seconds / 60 - hour * 60)
    const second = seconds - hour * 3600 - minute * 60

    return `${hour === 0 ? '' : hour + 'h'}${minute === 0 && hour === 0 ? '' : minute + 'm'}${second}s`
}
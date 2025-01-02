import { type PopupResult } from "@popup/common"
import { t } from "@popup/locale"
import { getPrimaryTextColor, getSecondaryTextColor } from "@util/style"
import { formatTime, parseTime } from "@util/time"
import { type TitleComponentOption } from "echarts"

function combineDate(start: Date, end: Date, format: string): string {
    const startStr = formatTime(start, format)
    const endStr = formatTime(end, format)
    if (startStr === endStr) {
        return startStr
    }
    const normalStr = `${startStr}-${endStr}`

    const sy = start.getFullYear()
    const ey = end.getFullYear()
    if (sy !== ey) {
        // Different years
        return normalStr
    }

    // The same years
    const execRes = /({d}|{m})[^{}]*({d}|{m})/.exec(format)
    let monthDatePart = execRes?.[0]

    if (!monthDatePart) return normalStr

    const newPart = `${monthDatePart}-${monthDatePart.replace('{m}', '{em}').replace('{d}', '{ed}')}`
    const newFormat = format.replace(monthDatePart, newPart)
    const em = end.getMonth() + 1
    const ed = end.getDate()
    return formatTime(start, newFormat)
        .replace('{em}', em.toString().padStart(2, '0'))
        .replace('{ed}', ed.toString().padStart(2, '0'))
}

function calculateSubTitleText(date: Date | [Date, Date?], dataDate: [string, string]): string {
    const format = t(msg => msg.calendar.dateFormat)

    if (!date) {
        date = dataDate?.map(parseTime) as [Date, Date]
    } else if (!(date instanceof Array)) {
        // Single day
        return formatTime(date, format)
    }

    const [start, end] = date
    if (!start && !end) return ''
    if (!start) return formatTime(end, format)
    if (!end) return formatTime(start, format)

    return combineDate(start, end, format)
}

export function generateTextOption(result: PopupResult): TitleComponentOption {
    const { chartTitle, date, dataDate } = result || {}
    return {
        text: chartTitle,
        subtext: calculateSubTitleText(date, dataDate),
        left: 'center',
        textStyle: { color: getPrimaryTextColor() },
        subtextStyle: { color: getSecondaryTextColor() },
        top: 10,
    }
}
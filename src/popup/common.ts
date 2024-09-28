import { t } from "@i18n"
import calendarMessages from "@i18n/message/common/calendar"

const KEYS: { [duration in timer.option.PopupDuration]: () => string } = {
    today: () => t(calendarMessages, { key: msg => msg.range.today }),
    thisWeek: () => t(calendarMessages, { key: msg => msg.range.thisWeek }),
    thisMonth: () => t(calendarMessages, { key: msg => msg.range.thisMonth }),
    last30Days: () => t(calendarMessages, { key: msg => msg.range.lastDays, param: { n: 30 } }),
    allTime: () => t(calendarMessages, { key: msg => msg.range.allTime })
}

export const durationLabelOf = (duration: timer.option.PopupDuration): string => {
    const key = KEYS[duration]
    return t(calendarMessages, { key })
}

export type PopupRow = timer.stat.Row & { isOther?: boolean }

export type PopupQueryResult = {
    type: timer.stat.Dimension
    mergeHost: boolean
    data: PopupRow[]
    dataDate: [string, string]
    // Filter items
    chartTitle: string
    date: Date | [Date, Date?]
    dateLength: number
}


export type PopupRow = timer.stat.Row & { isOther?: boolean }

export type PopupQuery = {
    mergeHost: boolean
    duration: timer.option.PopupDuration
    durationNum?: number
    type: timer.stat.Dimension
}

export type PopupResult = {
    query: PopupQuery
    // Actually date range according to duration
    date: Date | [Date, Date?]
    displaySiteName: boolean
    data: PopupRow[]
    dataDate: [string, string]
    // Filter items
    chartTitle: string
    dateLength: number
}

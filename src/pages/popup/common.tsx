export type PopupQuery = {
    mergeMethod: timer.stat.MergeMethod
    duration: timer.option.PopupDuration
    durationNum?: number
    type: timer.core.Dimension
}

export type PopupResult = {
    query: PopupQuery
    rows: timer.stat.Row[]
    // Actually date range according to duration
    date: Date | [Date, Date?]
    displaySiteName: boolean
    dataDate: [string, string]
    chartTitle: string
    itemCount: number
    dateLength: number
}

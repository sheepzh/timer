type PopupRow = timer.stat.Row & { isOther?: boolean }

type PopupQueryResult = {
    type: timer.stat.Dimension
    mergeHost: boolean
    data: PopupRow[]
    // Filter items
    chartTitle: string
    date: Date | [Date, Date?]
    dateLength: number
}

type PopupDuration = timer.option.PopupDuration
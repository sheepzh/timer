declare type TrendHostInfo = {
    host: string
    merged: boolean
}

declare type TrendFilterOption = {
    host: TrendHostInfo,
    dateRange: Date[],
    timeFormat: timer.app.TimeFormat
}

declare type TrendRenderOption = TrendFilterOption & {
    /**
     * Whether render firstly
     */
    isFirst: boolean
}
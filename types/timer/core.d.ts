declare namespace timer.core {
    type Event = {
        start: number
        end: number
        url: string
        ignoreTabCheck: boolean
    }

    /**
     * The dimension to statistics
     */
    type Dimension =
        // Focus time
        | 'focus'
        // Visit count
        | 'time'

    /**
     * The stat result of host
     *
     * @since 0.0.1
     */
    type Result = {
        [item in Dimension]: number
    }

    /**
     * The unique key of each data row
     */
    type RowKey = {
        host: string
        date: string
    }

    type Row = RowKey & Result
}
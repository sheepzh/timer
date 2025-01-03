
declare type FileFormat = 'json' | 'csv'

declare type SortDirect = 'ascending' | 'descending'

declare type SortInfo = {
    prop: timer.core.Dimension | 'host'
    order: SortDirect
}

/**
* The query param of report page
*/
declare type ReportQueryParam = {
    /**
     * Merge host
     */
    mh?: string
    /**
     * Merge date
     */
    md?: string
    /**
     * Date start
     */
    ds?: string
    /**
     * Date end
     */
    de?: string
    /**
     * Sorted column
     */
    sc?: timer.core.Dimension
}
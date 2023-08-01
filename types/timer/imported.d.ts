/**
 * @since 1.9.2
 */
declare namespace timer.imported {
    type ConflictResolution = 'overwrite' | 'accumulate'

    type Row = Required<timer.stat.RowKey> & Partial<timer.stat.Result> & {
        exist?: timer.stat.Result
    }

    type Data = {
        // Whether there is data for this dimension
        [dimension in timer.stat.Dimension]?: boolean
    } & {
        rows: Row[]
    }
}
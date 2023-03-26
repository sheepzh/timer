/**
 * @since 1.2.0
 */
declare namespace timer.backup {

    type Type =
        | 'none'
        | 'gist'

    /**
     * Snapshot of last backup
     */
    type Snapshot = {
        /**
         * Timestamp
         */
        ts: number
        /**
         * The date of the ts
         */
        date: string
    }

    /**
     * Snapshot cache
     */
    type SnaptshotCache = Partial<{
        [type in Type]: Snapshot
    }>

    type MetaCache = Partial<Record<Type, unknown>>
}
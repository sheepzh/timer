declare namespace timer.stat {
    /**
     * A set of results
     *
     * @since 0.3.3
     */
    type ResultSet = { [host: string]: core.Result }

    type StatKey = {
        siteKey?: timer.site.SiteKey
        cateKey?: number
        // Absent if date merged
        date?: string
    }

    type SiteExtend = {
        /**
         * Icon url
         */
        iconUrl?: string
        /**
         * The alias name of this Site, always is the title of its homepage by detected
         */
        alias?: string
        /**
         * @since 3.0.0
         */
        cateId?: number
    }

    /**
     * Row of each statistics result
     */
    type Row = StatKey & core.Result & backup.RowExtend & SiteExtend & {
        /**
         * The merged domains
         * Can't be empty if merged
         *
         * @since 0.1.5
         */
        mergedRows?: Row[]
        /**
         * The merged dates
         *
         * @since 2.4.7
         */
        mergedDates?: string[]
        /**
         * The composition of data when querying remote
         */
        composition?: RemoteComposition
    }

    type RemoteCompositionVal =
        // Means local data
        number | {
            /**
             * Client's id
             */
            cid: string
            /**
             * Client's name
             */
            cname?: string
            value: number
        }

    /**
     * @since 1.4.7
     */
    type RemoteComposition = {
        [item in core.Dimension]: RemoteCompositionVal[]
    }

    /**
     * @since 3.0.0
     */
    type MergeMethod = 'cate' | 'date' | 'domain'
}
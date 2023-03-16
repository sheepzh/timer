declare namespace timer.stat {
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
     * A set of results
     * 
     * @since 0.3.3
     */
    type ResultSet = { [host: string]: Result }

    /**
     * The unique key of each data row
     */
    type RowKey = {
        host: string
        // Absent if date merged
        date?: string
    }

    type RowBase = RowKey & Result

    /**
     * Row of each statistics result
     */
    type Row = RowBase & {
        /**
         * The merged domains
         * 
         * Can't be empty if merged
         * 
         * @since 0.1.5
         */
        mergedHosts: Row[]
        /**
         * Whether virtual host
         * 
         * @since 1.6.0
         */
        virtual: boolean
        /**
         * The composition of data when querying remote
         */
        composition?: RemoteComposition
        /**
         * Icon url
         * 
         * Must be undefined if merged
         */
        iconUrl?: string
        /**
         * The alias name of this Site, always is the title of its homepage by detected
         */
        alias?: string
        /**
         * The id of client where the remote data is storaged
         */
        cid?: string
        /**
         * The name of client where the remote data is storaged
         */
        cname?: string
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
        [item in Dimension]: RemoteCompositionVal[]
    }

}
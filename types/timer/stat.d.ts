declare namespace timer.stat {
    type SiteTarget = {
        siteKey: timer.site.SiteKey
    }
    type CateTarget = {
        cateKey: number
    }
    type GroupTarget = {
        groupKey: number
    }
    type TargetKey = SiteTarget | CateTarget | GroupTarget
    type DateKey = { date?: string }
    type StatKey = TargetKey & DateKey

    type SiteMergeExtend = {
        /**
         * The merged domains
         * Can't be empty if merged
         *
         * @since 0.1.5
         */
        mergedRows?: Omit<timer.stat.SiteRow, 'mergedRows'>[]
    }

    type DateMergeExtend = {
        /**
         * The merged dates
         *
         * @since 2.4.7
         */
        mergedDates?: string[]
    }

    type RemoteExtend = {
        /**
         * The composition of data when querying remote
         */
        composition?: RemoteComposition
    }

    interface SiteRow extends SiteTarget, DateKey, core.Result, backup.RowExtend, SiteMergeExtend, DateMergeExtend, RemoteExtend {
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

    interface CateRow extends CateTarget, DateKey, core.Result, backup.RowExtend, SiteMergeExtend, DateMergeExtend, RemoteExtend {
        cateName: string | undefined
    }

    interface GroupRow extends GroupTarget, DateKey, DateMergeExtend, core.Result {
        color: `${chrome.tabGroups.Color}` | undefined
        title: string | undefined
    }

    /**
     * Row of each statistics result
     */
    type Row = SiteRow | CateRow | GroupRow

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
    type MergeMethod = 'cate' | 'date' | 'domain' | 'group'
}
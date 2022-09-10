
/**
 * The options
 * 
 * @since 0.3.0
 */
declare namespace timer {
    namespace option {

        /**
         * Options used for the popup page
         */
        type PopupOption = {
            /**
             * The max count of today's data to display in popup page
             */
            popupMax: number
            /**
             * The default type to display
             */
            defaultType: stat.Dimension
            /**
             * The default duration to search
             * @since 0.6.0
             */
            defaultDuration: popup.Duration
            /**
             * Replace the host name with site name which is detected automatically from the title of site homepages,
             * or modified manually by the user
             * 
             * @since 0.5.0
             */
            displaySiteName: boolean
        }

        type DarkMode =
            // Always on
            | "on"
            // Always off
            | "off"
            // Timed on
            | "timed"

        type AppearanceOption = {
            /**
             * Whether to display the whitelist button in the context menu
             * 
             * @since 0.3.2
             */
            displayWhitelistMenu: boolean
            /**
             * Whether to display the badge text of focus time
             * 
             * @since 0.3.3
             */
            displayBadgeText: boolean
            /**
             * The language of this extension
             * 
             * @since 0.8.0
             */
            locale: LocaleOption
            /**
             * Whether to print the info in the console
             * 
             * @since 0.8.6
             */
            printInConsole: boolean
            /**
             * The state of dark mode
             * 
             * @since 1.1.0
             */
            darkMode: DarkMode

            /**
             * The range of seconds to turn on dark mode. Required if {@param darkMode} is 'timed'
             * 
             * @since 1.1.0
             */
            darkModeTimeStart?: number
            darkModeTimeEnd?: number
        }

        type StatisticsOption = {
            /**
             * Count when idle
             */
            countWhenIdle: boolean
            /**
             * Whether to collect the site name
             * 
             * @since 0.5.0
             */
            collectSiteName: boolean
            /**
             * Whether to count the local files
             * @since 0.7.0
             */
            countLocalFiles: boolean
        }

        /**
         * The options of backup
         * 
         * @since 1.2.0
         */
        type BackupOption = {
            /**
             * The type 2 backup
             */
            backupType: backup.Type
            /**
             * The auth of types, maybe ak/sk or static token
             */
            backupAuths: { [type in backup.Type]?: string }
            /**
             * The name of this client
             */
            clientName: string
        }

        type AllOption = PopupOption & AppearanceOption & StatisticsOption & BackupOption
        /**
         * @since 0.8.0
         */
        type LocaleOption = Locale | "default"
    }

    namespace meta {
        type ExtensionMeta = {
            installTime?: number
            appCounter?: { [routePath: string]: number }
            popupCounter?: {
                _total?: number
            }
            /**
             * The id of this client
             * 
             * @since 1.2.0
             */
            cid?: string
        }
    }

    /**
     * @since 0.8.0
     */
    type Locale =
        | 'zh_CN'
        | 'en'
        | 'ja'
        // @since 0.9.0
        | 'zh_TW'

    namespace stat {
        /**
         * The dimension to statistics
         */
        type Dimension =
            // Running time
            | 'total'
            // Focus time
            | 'focus'
            // Visit count
            | 'time'

        /**
         * Time waste per day
         * 
         * @since 0.0.1
         */
        type Result = { [item in timer.stat.Dimension]: number }

        /**
         * Waste data
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
             * Icon url
             * 
             * Must be undefined if merged
             */
            iconUrl?: string
            /**
             * The alias name of this Site, always is the title of its homepage by detected
             */
            alias?: string
        }
        /**
         * @since 1.2.0
         */
        type RemoteRow = RowBase & {
            /**
             * The name of client where the remote data is storaged
             */
            clientName?: string
        }
    }

    namespace limit {
        /**
         * @since 0.8.4
         */
        type Item = {
            /**
             * Condition, can be regular expression with star signs
             */
            cond: string
            regular: RegExp
            /**
             * Time limit, seconds
             */
            time: number
            enabled: boolean
            allowDelay: boolean
            /**
             * Waste today, milliseconds
             */
            waste?: number
        }
        type Rule = {
            /**
             * Condition, can be regular expression with star signs
             */
            cond: string
            /**
             * Time limit, seconds
             */
            time: number
            enabled: boolean
            /**
             * Allow to delay 5 minutes if time over
             */
            allowDelay: boolean
        }
        type Record = Rule & {
            /**
             * The latest record date
             */
            latestDate: string
            /**
             * Time wasted in the latest record date
             */
            wasteTime: number
        }
    }

    namespace period {
        type Key = {
            year: number
            month: number
            date: number
            /**
             * 0~95
             * ps. 95 = 60 / 15 * 24 - 1
             */
            order: number
        }
        type Result = Key & {
            /**
             * 1~900000
             * ps. 900000 = 15min * 60s/min * 1000ms/s
             */
            milliseconds: number
        }
        type Row = {
            /**
             * {yyyy}{mm}{dd}
             */
            date: string
            startTime: Date
            endTime: Date
            /**
             * 1 - 60000
             * ps. 60000 = 60s * 1000ms/s
             */
            milliseconds: number
        }
    }

    namespace merge {
        type Rule = {
            /**
             * Origin host, can be regular expression with star signs
             */
            origin: string
            /**
             * The merge result
             * 
             * + Empty string means equals to the origin host
             * + Number means the count of kept dots, must be natural number (int & >=0)
             */
            merged: string | number
        }
        interface Merger {
            merge(host: string): string
        }
    }

    namespace common {
        type Pagination = {
            size: number
            num: number
            total: number
        }
        type PageQuery = {
            num?: number
            size?: number
        }
        type PageResult<T> = {
            list: T[]
            total: number
        }
    }

    namespace popup {
        type Duration = "today" | "thisWeek" | "thisMonth"
        type Row = timer.stat.Row & { isOther?: boolean }
        type QueryResult = {
            type: timer.stat.Dimension
            mergeHost: boolean
            data: Row[]
            // Filter items
            chartTitle: string
            date: Date | Date[]
            dateLength: number
        }
        type QueryResultHandler = (result: QueryResult) => void
        type ChartProps = QueryResult & {
            displaySiteName: boolean
        }
    }

    namespace app {
        /**
         * @since 1.1.7
         */
        type TimeFormat =
            | "default"
            | "second"
            | "minute"
            | "hour"

        namespace trend {
            type HostInfo = {
                host: string
                merged: boolean
            }

            type FilterOption = {
                host: HostInfo,
                dateRange: Date[],
                timeFormat: TimeFormat
            }

            type RenderOption = FilterOption & {
                /**
                 * Whether render firstly
                 */
                isFirst: boolean
            }
        }

        namespace report {
            /**
             * The query param of report page
             */
            type QueryParam = {
                /**
                 * Merge host
                 */
                mh?: string
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
                sc?: timer.stat.Dimension
            }
            type FilterOption = {
                host: string
                dateRange: Date[]
                mergeDate: boolean
                mergeHost: boolean
                /**
                 * @since 1.1.7
                 */
                timeFormat: TimeFormat
            }
        }
    }

    /**
     * @since 1.2.0
     */
    namespace backup {

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

    namespace site {

        /**
         * @since 0.5.0
         */
        type AliasSource =
            | 'USER'        // By user
            | 'DETECTED'    // Auto-detected

        type AliasKey = {
            host: string
            /**
             * @since 1.2.1
             */
            merged?: boolean
        }
        /**
         * @since 0.5.0
         */
        type AliasValue = {
            name: string
            source: AliasSource
        }
        type Alias = AliasKey & AliasValue
        type AliasIcon = Alias & {
            iconUrl?: string
        }
    }

    /**
     * Message queue
     */
    namespace mq {
        type ReqCode =
            | 'openLimitPage'
            | 'limitTimeMeet'
            // @since 0.9.0
            | 'limitWaking'
        type ResCode = "success" | "fail" | "ignore"

        /**
         * @since 0.2.2
         */
        type Request<T = any> = {
            code: ReqCode
            data: T
        }
        /**
         * @since 0.8.4
         */
        type Response<T = any> = {
            code: ResCode,
            msg?: string
            data?: T
        }
        /**
         * @since 0.8.4
         */
        type Callback<T = any> = (result?: Response<T>) => void
    }
}
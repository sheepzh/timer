
/**
 * The options
 * 
 * @since 0.3.0
 */
declare namespace timer {
    namespace option {
        type PopupDuration = "today" | "thisWeek" | "thisMonth"
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
            defaultDuration: PopupDuration
            /**
             * Replace the host name with site name which is detected automatically from the title of site homepages,
             * or modified manually by the user
             * 
             * @since 0.5.0
             */
            displaySiteName: boolean
            /**
             * The start of one week
             * 
             * @since 1.2.5
             */
            weekStart: WeekStartOption
            /**
             * Whether to merge domain by default
             * 
             * @since 1.3.2
             */
            defaultMergeDomain: boolean
        }

        /**
         * @since 1.2.5
         */
        type WeekStartOption =
            | 'default'
            | number  // Weekday, From 1 to 7

        type DarkMode =
            // Follow the OS, @since 1.3.3
            | "default"
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
            /**
             * The filter of limit mark
             * @since 1.3.2
             */
            limitMarkFilter: limit.FilterType
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
     * The source locale
     * 
     * @since 1.4.0
     */
    type SourceLocale = 'en'

    /**
     * @since 0.8.0
     */
    type Locale = SourceLocale
        | 'zh_CN'
        | 'ja'
        // @since 0.9.0
        | 'zh_TW'

    /**
     * Translating locales
     * 
     * @since 1.4.0
     */
    type TranslatingLocale =
        | 'de'
        | 'es'
        | 'ko'
        | 'pl'
        | 'pt'
        | 'pt_BR'
        | 'ru'
        | 'uk'
        | 'fr'
        | 'it'
        | 'sv'

    namespace stat {
        /**
         * The dimension to statistics
         */
        type Dimension =
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
         * Limit rule in runtime
         * 
         * @since 0.8.4
         */
        type Item = Rule & {
            regular: RegExp
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
        /**
         * @since 1.3.2
         */
        type FilterType =
            // translucent filter
            | 'translucent'
            // ground glass filter
            | 'groundGlass'
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

    namespace app {
        /**
         * @since 1.1.7
         */
        type TimeFormat =
            | "default"
            | "second"
            | "minute"
            | "hour"
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
            // @since 1.2.3
            | 'limitChanged'
            // Request by content script
            // @since 1.3.0
            | "cs.isInWhitelist"
            | "cs.incVisitCount"
            | "cs.printTodayInfo"
            | "cs.getTodayInfo"
            | "cs.moreMinutes"
            | "cs.getLimitedRules"
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
         * @since 1.3.0
         */
        type Handler<Req, Res> = (data: Req) => Promise<Res>
        /**
         * @since 0.8.4
         */
        type Callback<T = any> = (result?: Response<T>) => void
    }
}

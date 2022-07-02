
/**
 * The options
 * 
 * @since 0.3.0
 */
declare namespace timer {
    type DataDimension = 'total' | 'focus' | 'time'
    type PopupDuration = "today" | "thisWeek" | "thisMonth"
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
            defaultType: DataDimension
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

        type AllOption = PopupOption & AppearanceOption & StatisticsOption
        /**
         * @since 0.8.0
         */
        type LocaleOption = Locale | "default"
    }

    namespace meta {
        type SyncMeta = {
            timer?: number
        }
        type ExtensionMeta = {
            installTime?: number
            appCounter?: { [routePath: string]: number }
            popupCounter?: {
                _total?: number
            }
            /**
             * @since 1.2.0
             */
            sync?: SyncMeta
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

}
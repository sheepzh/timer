/**
 * The options
 *
 * @since 0.3.0
 */
declare namespace timer.option {
    type PopupDuration =
        | "today" | "thisWeek" | "thisMonth"
        | "last30Days"
    /**
     * Options used for the popup page
     */
    type PopupOption = {
        /**
         * The max count of today's data to display on popup page
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
         * The background color of badge text
         *
         * @since 2.3.0
         */
        badgeBgColor?: string
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
        /**
         * The start of one week
         * @since 2.4.1
         */
        weekStart?: WeekStartOption
    }

    type DailyLimitOption = {
        /**
         * Motto displayed when restricted
         */
        limitPrompt?: string
        /**
         * restriction level
         */
        limitLevel: limit.RestrictionLevel
        /**
         * The password to unlock
         */
        limitPassword: string
        /**
         * The difficulty of verification
         */
        limitVerifyDifficulty: limit.VerificationDifficulty
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
         * The extended information of types, including url, file path, and so on
         */
        backupExts?: {
            [type in backup.Type]?: backup.TypeExt
        }
        /**
         * The name of this client
         */
        clientName: string
        /**
         * Whether to auto-backup data
         */
        autoBackUp: boolean
        /**
         * Interval to auto-backup data, minutes
         */
        autoBackUpInterval: number
    }

    type AllOption = PopupOption & AppearanceOption & StatisticsOption & DailyLimitOption & BackupOption
    /**
     * @since 0.8.0
     */
    type LocaleOption = Locale | "default"
}


/**
 * The options
 * 
 * @since 0.3.0
 */
declare namespace Timer {
    type DataDimension = 'total' | 'focus' | 'time'
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

    type Option = PopupOption & AppearanceOption & StatisticsOption

    /**
     * @since 0.8.0
     */
    type Locale = 'zh_CN' | 'en' | 'ja'
    /**
     * @since 0.8.0
     */
    type LocaleOption = Locale | "default"
}
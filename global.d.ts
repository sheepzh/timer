
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
    }

    type Option = PopupOption & AppearanceOption & StatisticsOption
}
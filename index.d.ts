declare module "*.json" {
    const value: any
    export default value
}

/**
 * The options
 * 
 * @since 0.3.0
 */
declare namespace Timer {
    type SiteItem = 'total' | 'focus' | 'time'
    /**
     * Options used for the popup page
     */
    type PopupOption = {
        /**
         * The max count of today's data to display in popup page
         */
        popupMax: number
        /**
         * The default to display
         */
        defaultType: SiteItem
    }
    type Option = PopupOption
}
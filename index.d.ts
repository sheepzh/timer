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
    interface Option {
        /**
         * The max count of today's data to display in popup page
         */
        popupMax: number
    }
}
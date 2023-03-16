declare namespace timer.site {
    /**
     * @since 0.5.0
     */
    type AliasSource =
        | 'USER'        // By user
        | 'DETECTED'    // Auto-detected
    type SiteKey = {
        host: string
        /**
         * @since 1.2.1
         */
        merged?: boolean
        /**
         * Whether visual site
         * 
         * @since 1.6.0
         */
        virtual?: boolean
    }
    type SiteInfo = SiteKey & {
        alias?: string
        /**
         * The source of name
         */
        source?: AliasSource
        iconUrl?: string
    }
}
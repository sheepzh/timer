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
         * Whether virtual site
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
        /**
         * Category ID
         *
         * @since 2.6.0
         */
        cate?: number
    }

    /**
     * Site tag
     *
     * @since 2.6.0
     */
    type Cate = {
        id: number
        label: string
        color?: string
    }
}
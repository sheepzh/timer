declare namespace timer.site {
    /**
     * @since 0.5.0
     */
    type AliasSource =
        | 'USER'        // By user
        | 'DETECTED'    // Auto-detected
    type SiteKey = {
        host: string
        type: timer.site.Type
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
    type Type = 'normal' | 'merged' | 'virtual'
    /**
     * Site tag
     *
     * @since 2.6.0
     */
    type Cate = {
        id: number
        name: string
    }
}
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
         * @since 3.0.0
         */
        cate?: number
        /**
         * Whether to count the running time
         *
         * @since 3.2.0
         */
        run?: boolean
    }
    type Type = 'normal' | 'merged' | 'virtual'
    /**
     * Site tag
     *
     * @since 3.0.0
     */
    type Cate = {
        id: number
        name: string
    }
}
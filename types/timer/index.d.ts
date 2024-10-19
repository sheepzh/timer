declare namespace timer {
    /**
     * The source locale
     *
     * @since 1.4.0
     */
    type SourceLocale = 'en'
    /**
     * The locale must be translated with code
     *
     * @since 1.5.3
     */
    type RequiredLocale = SourceLocale | 'zh_CN'
    type OptionalLocale =
        | 'ja'
        // @since 0.9.0
        | 'zh_TW'
        // @since 1.8.2
        | 'pt_PT'
        // @since 2.1.0
        | 'uk'
        // @since 2.1.4
        | 'es'
        // @since 2.2.7
        | 'de'
        // @since 2.3.6
        | 'fr'
        // @since 2.4.6
        | 'ru'
        // @since 2.5.0
        | 'ar'

    /**
     * @since 0.8.0
     */
    type Locale = RequiredLocale | OptionalLocale

    /**
     * Translating locales
     *
     * @since 1.4.0
     */
    type TranslatingLocale =
        | 'ko'
        | 'pl'
        | 'it'
        | 'sv'
        | 'fi'
        | 'da'
        | 'hr'
        | 'id'
        | 'tr'
        | 'cs'
        | 'ro'
        | 'nl'
        | 'vi'
        | 'sk'
        | 'mn'
        | 'hi'

    type ExtensionMetaFlag = "rateOpen"

    type ExtensionMeta = {
        installTime?: number
        appCounter?: { [routePath: string]: number }
        popupCounter?: {
            _total?: number
        }
        /**
         * The id of this client
         *
         * @since 1.2.0
         */
        cid?: string
        backup?: {
            [key in timer.backup.Type]?: {
                ts: number
                msg?: string
            }
        }
        // Flags
        flag?: Partial<Record<ExtensionMetaFlag, boolean>>
    }
}
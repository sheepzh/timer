/**
 * The directory of messages
 */
type Dir =
    | 'app'
    | 'common'
    | 'popup'
    | 'side'
    | 'cs'

/**
 * Key of crowdin file/directory
 */
type NameKey = {
    name: Dir
    branchId: number
}

type TranslationKey = {
    stringId: number
    lang: CrowdinLanguage
}

/**
 * Items of message
 */
type ItemSet = {
    [path: string]: string
}

/**
 * The language code of crowdin
 *
 * @see https://developer.crowdin.com/language-codes/
 */
type CrowdinLanguage =
    | 'zh-CN'
    | 'en'
    | 'zh-TW'
    | 'ja'
    | 'pt-PT'
    | 'uk'
    | 'es-ES'
    | 'de'
    | 'fr'
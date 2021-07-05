export type ChromeMessageCode = 'openLimitPage'
/**
 * Chrome message
 * @since 0.2.2
 */
export type ChromeMessage<T> = {
    code: ChromeMessageCode
    data: T
}
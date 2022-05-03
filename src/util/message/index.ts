/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

export type ChromeMessageCode =
    | 'openLimitPage'
    | 'limitTimeMeet'
    // @since 0.9.0
    | 'limitWaking'

export type ChromeResultCode = "success" | "fail" | "ignore"

/**
 * Chrome message
 * @since 0.2.2
 */
export type ChromeMessage<T = any> = {
    code: ChromeMessageCode
    data: T
}

/**
 * @since 0.8.4
 */
export type ChromeResult<T = any> = {
    code: ChromeResultCode,
    msg?: string
    data?: T
}

/**
 * @since 0.8.4
 */
export type ChromeCallback<T = any> = (result?: ChromeResult<T>) => void
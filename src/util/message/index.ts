/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

export type ChromeMessageCode = 'openLimitPage'
/**
 * Chrome message
 * @since 0.2.2
 */
export type ChromeMessage<T> = {
    code: ChromeMessageCode
    data: T
}
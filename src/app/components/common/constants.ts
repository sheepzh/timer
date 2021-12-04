/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

export type QueryData = () => Promise<void>

export type PaginationInfo = {
    size: number
    num: number
    total: number
}
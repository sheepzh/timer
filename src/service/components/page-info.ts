/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

/**
 * Reconstruct 
 * 
 * @since 0.5.2
 */
export type PageResult<T> = {
    list: T[]
    total: number
}

/**
 * Reconstruct 
 * 
 * @since 0.5.2
 */
export type PageParam = {
    pageNum?: number
    pageSize?: number
}

const DEFAULT_PAGE_NUM = 1
const DEFAULT_PAGE_SIZE = 10

/**
 * Slice the origin list to page
 * @returns 
 */
export function slicePageResult<T>(originList: T[], pageParam: PageParam): PageResult<T> {
    let pageNum = pageParam.pageNum
    let pageSize = pageParam.pageSize
    pageNum === undefined || pageNum < 1 && (pageNum = DEFAULT_PAGE_NUM)
    pageSize === undefined || pageSize < 1 && (pageSize = DEFAULT_PAGE_SIZE)
    const startIndex = (pageNum - 1) * pageSize
    const endIndex = (pageNum) * pageSize
    const total = originList.length
    const list: T[] = startIndex >= total ? [] : originList.slice(startIndex, Math.min(endIndex, total))
    return { list, total }
}

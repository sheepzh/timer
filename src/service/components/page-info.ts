/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const DEFAULT_PAGE_NUM = 1
const DEFAULT_PAGE_SIZE = 10

/**
 * Slice the origin list to page
 */
export function slicePageResult<T>(originList: T[], pageQuery: timer.common.PageQuery): timer.common.PageResult<T> {
    let pageNum = pageQuery.num
    let pageSize = pageQuery.size
    pageNum === undefined || pageNum < 1 && (pageNum = DEFAULT_PAGE_NUM)
    pageSize === undefined || pageSize < 1 && (pageSize = DEFAULT_PAGE_SIZE)
    const startIndex = (pageNum - 1) * pageSize
    const endIndex = (pageNum) * pageSize
    const total = originList.length
    const list: T[] = startIndex >= total ? [] : originList.slice(startIndex, Math.min(endIndex, total))
    return { list, total }
}

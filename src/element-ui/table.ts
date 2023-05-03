/**
 * Copyright (c) 2023-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { TableColumnCtx } from "element-plus"

export type ElTableRowScope<T> = {
    row: T
}

export type ElTableSpanMethodProps<T> = {
    row: T
    column: TableColumnCtx<T>
    rowIndex: number
    columnIndex: number
}
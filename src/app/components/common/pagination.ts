/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElPagination } from "element-plus"
import { h, UnwrapRef } from "vue"
import { PaginationInfo, QueryData } from "./constants"

export type PaginationProps = {
    queryData: QueryData
    pageRef: UnwrapRef<PaginationInfo>
}

const handleSizeChange = (props: PaginationProps, size: number) => {
    props.pageRef.size = size
    props.queryData()
}

const handleCurrentChange = (props: PaginationProps, pageNum: number) => {
    props.pageRef.num = pageNum
    props.queryData()
}

const elPagination = (props: PaginationProps) => h(ElPagination,
    {
        onSizeChange: (size: number) => handleSizeChange(props, size),
        onCurrentChange: (pageNum: number) => handleCurrentChange(props, pageNum),
        currentPage: props.pageRef.num,
        pageSizes: [10, 20, 50],
        pageSize: props.pageRef.size,
        layout: "total, sizes, prev, pager, next, jumper",
        total: props.pageRef.total
    }
)

const pagination = (props: PaginationProps) => h('div', { class: 'pagination-container' }, elPagination(props))

export default pagination
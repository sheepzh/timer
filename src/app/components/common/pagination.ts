/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElPagination } from "element-plus"
import { defineComponent, h } from "vue"

const _default = defineComponent({
    name: "Pagination",
    props: {
        num: Number,
        size: Number,
        total: Number
    },
    emits: ["sizeChange", "numChange"],
    setup(props, ctx) {
        return () => h('div', { class: 'pagination-container' }, h(ElPagination,
            {
                currentPage: props.num,
                pageSizes: [10, 20, 50],
                pageSize: props.size,
                layout: "total, sizes, prev, pager, next, jumper",
                total: props.total,
                onSizeChange: (size: number) => ctx.emit("sizeChange", size),
                onCurrentChange: (pageNum: number) => ctx.emit("numChange", pageNum)
            }
        ))
    }
})

export default _default
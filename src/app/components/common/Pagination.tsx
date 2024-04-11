/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElPagination } from "element-plus"
import { PropType, defineComponent } from "vue"

const _default = defineComponent({
    props: {
        defaultValue: Object as PropType<timer.common.PageQuery>,
        total: Number
    },
    emits: {
        change: (_val: timer.common.PageQuery) => true,
    },
    setup(props, ctx) {
        return () => (
            <div class="pagination-container">
                <ElPagination
                    pageSizes={[10, 20, 50]}
                    defaultCurrentPage={(props.defaultValue as timer.common.PageQuery)?.num}
                    defaultPageSize={(props.defaultValue as timer.common.PageQuery)?.size}
                    layout="total, sizes, prev, pager, next, jumper"
                    total={props.total}
                    onChange={(currentPage, pageSize) => ctx.emit("change", { num: currentPage, size: pageSize })}
                />
            </div>
        )
    }
})

export default _default
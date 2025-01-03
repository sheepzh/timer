/**
 * Copyright (c) 2021-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElCard, ElScrollbar } from "element-plus"
import ContentCard from "./ContentCard"
import { defineComponent, h, useSlots } from "vue"

const _default = defineComponent(() => {
    const { default: default_, filter, content } = useSlots()
    return () => (
        <ElScrollbar>
            <div class="content-container">
                {filter && <ElCard class="filter-container" v-slots={filter} />}
                {default_ && h(default_)}
                {!default_ && content && <ContentCard v-slots={content} />}
            </div>
        </ElScrollbar>
    )
})

export default _default
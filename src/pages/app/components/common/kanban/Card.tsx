/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { CLZ_HIDDEN_XS_ONLY } from "@pages/element-ui/style"
import { classNames } from "@pages/util/style"
import { ElCard } from "element-plus"
import { defineComponent, h } from "vue"
import "./card.sass"

const _default = defineComponent({
    props: {
        title: String
    },
    setup(props, ctx) {
        const { default: default_, filter } = ctx.slots
        return () => (
            <ElCard class="kanban-card">
                <div class="kanban-card-title">
                    {props.title}
                </div>
                {!!filter && (
                    <div class={classNames('kanban-card-filter-wrapper', CLZ_HIDDEN_XS_ONLY)}>
                        {h(filter)}
                    </div>
                )}
                {!!default_ && h(default_, { class: 'kanban-card-body' })}
            </ElCard>
        )
    },
})

export default _default
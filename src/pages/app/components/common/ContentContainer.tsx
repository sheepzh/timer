/**
 * Copyright (c) 2021-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElCard, ElScrollbar } from "element-plus"
import { defineComponent, h, type StyleValue, useSlots } from "vue"
import ContentCard from "./ContentCard"
import { useMediaSize } from "@hooks/useMediaSize"

const CONTAINER_STYLE: StyleValue = {
    marginTop: 'var(--timer-container-container-padding)',
    marginBottom: 'var(--timer-container-container-padding)',
    height: 'calc(100% - var(--timer-container-container-padding))',
    padding: '0 var(--timer-container-container-padding)',
    overflow: 'hidden',
}

const FILTER_CONTAINER_STYLE: StyleValue = {
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
    userSelect: 'none',
}

const FILTER_BODY_STYLE: StyleValue = {
    paddingBottom: '18px',
    paddingTop: '18px',
    boxSizing: 'border-box',
    width: '100%',
}

const _default = defineComponent(() => {
    const { default: default_, filter, content } = useSlots()
    const mediaSize = useMediaSize()
    return () => (
        <ElScrollbar>
            <div style={CONTAINER_STYLE}>
                {filter && (
                    <ElCard
                        class="filter-container"
                        style={FILTER_CONTAINER_STYLE}
                        bodyStyle={FILTER_BODY_STYLE}
                        v-slots={filter}
                    />
                )}
                {!!default_ && h(default_)}
                {!default_ && content && <ContentCard v-slots={content} />}
            </div>
        </ElScrollbar>
    )
})

export default _default
/**
 * Copyright (c) 2021-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import Flex from "@pages/components/Flex"
import { ElCard } from "element-plus"
import { type FunctionalComponent, h, type StyleValue } from "vue"
import ContentCard from "./ContentCard"

const FILTER_CONTAINER_STYLE: StyleValue = {
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

export const FilterContainer: FunctionalComponent = (_, ctx) => (
    <ElCard
        class="filter-container"
        style={FILTER_CONTAINER_STYLE}
        bodyStyle={FILTER_BODY_STYLE}
        v-slots={ctx.slots}
    />
)

const _default: FunctionalComponent<{ class?: string }> = (props, ctx) => {
    const { default: default_, filter, content } = ctx.slots

    return (
        <Flex
            class={props.class}
            column
            height="100%"
            width="100%"
            padding={20}
            boxSizing="border-box"
            gap={15}
        >
            {filter && <FilterContainer>{h(filter)}</FilterContainer>}
            {!!default_ && <Flex column gap={15} flex={1} height={0} width="100%">{h(default_)}</Flex>}
            {!default_ && content && <ContentCard v-slots={content} />}
        </Flex>
    )
}

export default _default
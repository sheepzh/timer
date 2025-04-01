/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { defineComponent, ref, toRaw } from "vue"
import ContentContainer from "../common/ContentContainer"
import { useLimitProvider } from "./context"
import LimitFilter from "./LimitFilter"
import LimitModify, { type ModifyInstance } from "./LimitModify"
import LimitTable from "./LimitTable"
import LimitTest, { type TestInstance } from "./LimitTest"

const _default = defineComponent(() => {
    useLimitProvider()

    const modify = ref<ModifyInstance>()
    const test = ref<TestInstance>()
    const showModify = (row: timer.limit.Item) => modify.value?.modify?.(toRaw(row))
    const showCreate = () => modify.value?.create?.()
    const showTest = () => test.value?.show?.()

    return () => (
        <ContentContainer v-slots={{
            filter: () => <LimitFilter onCreate={showCreate} onTest={showTest} />,
            content: () => <>
                <LimitTable onModify={showModify} />
                <LimitModify ref={modify} />
                <LimitTest ref={test} />
            </>
        }} />
    )
})

export default _default

/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { defineComponent } from "vue"
import ContentContainer from "../common/ContentContainer"
import { useLimitProvider } from "./context"
import LimitFilter from "./LimitFilter"
import LimitModify from "./LimitModify"
import LimitTable from "./LimitTable"
import LimitTest from "./LimitTest"

const _default = defineComponent(() => {
    const { modifyInst, testInst } = useLimitProvider()

    return () => (
        <ContentContainer v-slots={{
            filter: () => <LimitFilter />,
            content: () => <>
                <LimitTable />
                <LimitModify ref={modifyInst} />
                <LimitTest ref={testInst} />
            </>
        }} />
    )
})

export default _default

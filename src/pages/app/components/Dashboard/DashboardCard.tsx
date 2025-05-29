/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElCard, ElCol } from "element-plus"
import type { FunctionalComponent, StyleValue } from "vue"

const DashboardCard: FunctionalComponent<{ span: number }> = (props, ctx) => (
    <ElCol span={props.span}>
        <ElCard
            style={{ height: '320px', marginBlockEnd: '15px' } satisfies StyleValue}
            bodyStyle={{ padding: '20px', width: '100%', height: '100%', boxSizing: 'border-box' }}
            v-slots={ctx.slots}
        />
    </ElCol>
)

export default DashboardCard

/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElCard } from "element-plus"
import { type FunctionalComponent, useSlots } from "vue"

const ContentCard: FunctionalComponent = () => (
    <ElCard
        style={{ minHeight: '640px' }}
        bodyStyle={{ height: '100%' }}
        v-slots={useSlots()}
    />
)

export default ContentCard
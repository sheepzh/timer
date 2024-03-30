/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { Ref } from "vue"

import { defineComponent, ref } from "vue"
import { t } from "@app/locale"
import DateFilter from "./DateFilter"
import NumberFilter from "./NumberFilter"
import { DateModelType, ElButton } from "element-plus"
import { Delete } from "@element-plus/icons-vue"

export type ClearFilterInstance = {
    getFilterOption(): DataManageClearFilterOption
}

const _default = defineComponent({
    emits: {
        delete: () => true
    },
    setup(_, ctx) {
        const dateRange: Ref<[DateModelType, DateModelType]> = ref([null, null])
        const focus: Ref<[string, string]> = ref(['0', '2'])
        const time: Ref<[string, string]> = ref(['0', ''])

        const instance: ClearFilterInstance = {
            getFilterOption: () => ({
                dateRange: dateRange.value,
                focusStart: focus.value?.[0],
                focusEnd: focus.value?.[1],
                timeStart: time.value?.[0],
                timeEnd: time.value?.[1],
            } as DataManageClearFilterOption)
        }

        ctx.expose(instance)

        return () => (
            <div class="clear-panel">
                <h3>{t(msg => msg.dataManage.filterItems)}</h3>
                <DateFilter dateRange={dateRange.value} onChange={val => dateRange.value = val} />
                <NumberFilter
                    translateKey="filterFocus"
                    defaultValue={focus.value}
                    lineNo={2}
                />
                <NumberFilter
                    translateKey="filterTime"
                    defaultValue={time.value}
                    lineNo={3}
                    onChange={val => time.value = val}
                />
                <div class="footer-container filter-container">
                    <ElButton
                        icon={<Delete />}
                        type="danger"
                        size="small"
                        onClick={() => ctx.emit("delete")}
                    >
                        {t(msg => msg.button.delete)}
                    </ElButton>
                </div>
            </div>
        )
    }
})

export default _default
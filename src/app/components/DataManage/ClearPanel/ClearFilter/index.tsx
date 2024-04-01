/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { defineComponent, ref } from "vue"
import { t } from "@app/locale"
import DateFilter from "./DateFilter"
import NumberFilter from "./NumberFilter"
import { ElButton } from "element-plus"
import { Delete } from "@element-plus/icons-vue"

const _default = defineComponent({
    emits: {
        delete: (_date: [Date, Date], _focus: [string, string], _time: [string, string]) => true
    },
    setup(_, ctx) {
        const date = ref<[Date, Date]>([null, null])
        const focus = ref<[string, string]>(['0', '2'])
        const time = ref<[string, string]>(['0', null])

        return () => (
            <div class="clear-panel">
                <h3>{t(msg => msg.dataManage.filterItems)}</h3>
                <DateFilter dateRange={date.value} onChange={(val: [Date, Date]) => date.value = val} />
                <NumberFilter
                    translateKey="filterFocus"
                    defaultValue={focus.value}
                    lineNo={2}
                    onChange={val => focus.value = val}
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
                        onClick={() => ctx.emit("delete", date.value, focus.value, time.value)}
                    >
                        {t(msg => msg.button.delete)}
                    </ElButton>
                </div>
            </div>
        )
    }
})

export default _default
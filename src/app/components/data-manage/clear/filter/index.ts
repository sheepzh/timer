/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { Ref } from "vue"

import { defineComponent, h, ref } from "vue"
import { t } from "@app/locale"
import DateFilter from "./date-filter"
import NumberFilter from "./number-filter"
import DeleteButton from "./delete-button"

const _default = defineComponent({
    emits: {
        delete: () => true
    },
    setup(_, ctx) {
        const dateRangeRef: Ref<Array<Date>> = ref([])
        const focusStartRef: Ref<string> = ref('0')
        const focusEndRef: Ref<string> = ref('2')
        const timeStartRef: Ref<string> = ref('0')
        const timeEndRef: Ref<string> = ref('')
        const computeFilterOption = () => ({
            dateRange: dateRangeRef.value,
            focusStart: focusStartRef.value,
            focusEnd: focusEndRef.value,
            timeStart: timeStartRef.value,
            timeEnd: timeEndRef.value,
        } as DataManageClearFilterOption)

        ctx.expose({
            getFilterOption: computeFilterOption
        })

        return () => h('div', { class: 'clear-panel' }, [
            h('h3', t(msg => msg.dataManage.filterItems)),
            h(DateFilter, { dateRange: dateRangeRef.value, onChange: (newVal: Date[]) => dateRangeRef.value = newVal }),
            h(NumberFilter, {
                translateKey: 'filterFocus',
                start: focusStartRef.value,
                end: focusEndRef.value,
                lineNo: 2,
                onStartChange: v => focusStartRef.value = v,
                onEndChange: v => focusEndRef.value = v,
            }),
            h(NumberFilter, {
                translateKey: 'filterTime',
                start: timeStartRef.value,
                end: timeEndRef.value,
                lineNo: 3,
                onStartChange: v => timeStartRef.value = v,
                onEndChange: v => timeEndRef.value = v,
            }),
            h(DeleteButton, {
                onClick: () => ctx.emit('delete')
            }),
        ])
    }
})

export default _default
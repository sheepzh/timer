/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { Back, Check } from "@element-plus/icons-vue"
import { ElButton, ElForm, ElMessage } from "element-plus"
import { PropType, Ref, computed, defineComponent, h, ref } from "vue"
import LimitTimeFormItem from "./LimitTimeFormItem"
import LimitPeriodFormItem from "./LimitPeriodFormItem"

export type RuleFormData = Pick<timer.limit.Rule, "time" | "visitTime" | "periods">

const _default = defineComponent({
    props: {
        rule: Object as PropType<timer.limit.Rule>
    },
    emits: {
        back: (_d: RuleFormData) => true,
        save: (_d: RuleFormData) => true,
    },
    setup({ rule }, ctx) {
        const time: Ref<number> = ref(rule?.time)
        const visitTime: Ref<number> = ref(rule?.visitTime)
        const periods: Ref<[number, number][]> = ref(rule?.periods || [])
        const formInfo = computed(() => ({ time: time.value, visitTime: visitTime.value, periods: periods.value } as RuleFormData))

        const handleSaveClick = () => {
            const value = formInfo.value
            const { time, visitTime, periods } = value || {}
            if (!time && !visitTime && !periods?.length) {
                ElMessage.error(t(msg => msg.limit.message.noRule))
                return
            }
            ctx.emit("save", value)
        }

        return () => [
            h(ElForm, { labelWidth: 180, labelPosition: "left" }, () => [
                h(LimitTimeFormItem, {
                    modelValue: time.value,
                    label: t(msg => msg.limit.item.time),
                    onChange: (newVal: number) => time.value = newVal,
                }),
                h(LimitTimeFormItem, {
                    modelValue: visitTime.value,
                    label: t(msg => msg.limit.item.visitTime),
                    onChange: (newVal: number) => visitTime.value = newVal,
                }),
                h(LimitPeriodFormItem, { modelValue: periods.value }),
            ]),
            h('div', { class: 'sop-footer' }, [
                h(ElButton, {
                    type: 'info',
                    icon: Back,
                    onClick: () => ctx.emit('back', formInfo.value),
                }, () => t(msg => msg.button.previous)),
                h(ElButton, {
                    type: 'success',
                    icon: Check,
                    onClick: handleSaveClick
                }, () => t(msg => msg.button.save)),
            ]),
        ]
    }
})

export default _default
/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Plus } from "@element-plus/icons-vue"
import { Ref, h, defineComponent, ref } from "vue"
import InputFilterItem from "@app/components/common/input-filter-item"
import SwitchFilterItem from "@app/components/common/switch-filter-item"
import ButtonFilterItem from "@app/components/common/button-filter-item"
import { t } from "@app/locale"

export type LimitFilterOption = {
    url: string
    onlyEnabled: boolean
}

const urlPlaceholder = t(msg => msg.limit.conditionFilter)
const onlyEnabledLabel = t(msg => msg.limit.filterDisabled)
const addButtonText = t(msg => msg.limit.button.add)

const _default = defineComponent({
    name: "LimitFilter",
    props: {
        url: String,
        onlyEnabled: Boolean
    },
    emits: ["create", "change"],
    setup(props, ctx) {
        const url: Ref<string> = ref(props.url)
        const onlyEnabled: Ref<boolean> = ref(props.onlyEnabled)
        const handleChange = () => ctx.emit("change", {
            url: url.value,
            onlyEnabled: onlyEnabled.value
        } as LimitFilterOption)
        return () => [
            h(InputFilterItem, {
                placeholder: urlPlaceholder,
                onSearch(searchVal: string) {
                    url.value = searchVal
                    handleChange()
                },
            }),
            h(SwitchFilterItem, {
                label: onlyEnabledLabel,
                defaultValue: onlyEnabled.value,
                onChange(newVal: boolean) {
                    onlyEnabled.value = newVal
                    handleChange()
                }
            }),
            h(ButtonFilterItem, {
                text: addButtonText,
                type: "success",
                icon: Plus,
                onClick: () => ctx.emit("create")
            })
        ]
    }
})

export default _default
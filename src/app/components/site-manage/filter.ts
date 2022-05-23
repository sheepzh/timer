/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import InputFilterItem from "@app/components/common/input-filter-item"
import SwitchFilterItem from "@app/components/common/switch-filter-item"
import ButtonFilterItem from "@app/components/common/button-filter-item"
import { Ref, h, defineComponent, ref } from "vue"
import { Plus } from "@element-plus/icons-vue"
import { t } from "@app/locale"

const hostPlaceholder = t(msg => msg.siteManage.hostPlaceholder)
const aliasPlaceholder = t(msg => msg.siteManage.aliasPlaceholder)
const onlyDetectedLabel = t(msg => msg.siteManage.onlyDetected)
const addButtonText = t(msg => msg.siteManage.button.add)

export type SiteManageFilterOption = {
    host: string,
    alias: string,
    onlyDetected: boolean,
}

const _default = defineComponent({
    name: "SiteManageFilter",
    props: {
        host: String,
        alias: String,
        onlyDetected: Boolean
    },
    emits: ["change", "create"],
    setup(props, ctx) {
        const host: Ref<string> = ref(props.host)
        const alias: Ref<string> = ref(props.alias)
        const onlyDetected: Ref<boolean> = ref(props.onlyDetected || false)
        const handleChange = () => ctx.emit("change", {
            host: host.value,
            alias: alias.value,
            onlyDetected: onlyDetected.value
        } as SiteManageFilterOption)
        return () => [
            h(InputFilterItem, {
                placeholder: hostPlaceholder,
                onSearch(searchVal: string) {
                    host.value = searchVal
                    handleChange()
                },
            }),
            h(InputFilterItem, {
                placeholder: aliasPlaceholder,
                onSearch(searchVal: string) {
                    alias.value = searchVal
                    handleChange()
                }
            }),
            h(SwitchFilterItem, {
                label: onlyDetectedLabel,
                defaultValue: false,
                onChange(newVal: boolean) {
                    onlyDetected.value = newVal
                    handleChange()
                }
            }),
            h(ButtonFilterItem, {
                text: addButtonText,
                icon: Plus,
                type: "success",
                onClick: () => ctx.emit("create")
            })
        ]
    }
})

export default _default
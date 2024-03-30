/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import InputFilterItem from "@app/components/common/input-filter-item"
import SwitchFilterItem from "@app/components/common/switch-filter-item"
import ButtonFilterItem from "@app/components/common/button-filter-item"
import { Ref, defineComponent, ref, PropType, watch } from "vue"
import { Plus } from "@element-plus/icons-vue"
import { t } from "@app/locale"

const hostPlaceholder = t(msg => msg.siteManage.hostPlaceholder)
const aliasPlaceholder = t(msg => msg.siteManage.aliasPlaceholder)
const onlyDetectedLabel = t(msg => msg.siteManage.onlyDetected)

const _default = defineComponent({
    props: {
        defaultValue: Object as PropType<SiteManageFilterOption>,
    },
    emits: {
        change: (_option: SiteManageFilterOption) => true,
        create: () => true,
    },
    setup(props, ctx) {
        const host: Ref<string> = ref(props.defaultValue?.host)
        const alias: Ref<string> = ref(props.defaultValue?.alias)
        const onlyDetected: Ref<boolean> = ref(props.defaultValue?.onlyDetected || false)
        watch([host, alias, onlyDetected], () => ctx.emit("change", {
            host: host.value,
            alias: alias.value,
            onlyDetected: onlyDetected.value
        }))
        return () => <>
            <InputFilterItem
                placeholder={hostPlaceholder}
                onSearch={val => host.value = val}
            />
            <InputFilterItem
                placeholder={aliasPlaceholder}
                onSearch={val => alias.value = val}
            />
            <SwitchFilterItem
                label={onlyDetectedLabel}
                defaultValue={props.defaultValue?.onlyDetected}
                onChange={val => onlyDetected.value = val}
            />
            <ButtonFilterItem
                text={t(msg => msg.button.create)}
                icon={<Plus />}
                type="success"
                onClick={() => ctx.emit("create")}
            />
        </>
    }
})

export default _default
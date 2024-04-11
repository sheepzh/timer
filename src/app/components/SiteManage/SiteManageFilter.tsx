/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import InputFilterItem from "@app/components/common/InputFilterItem"
import SwitchFilterItem from "@app/components/common/SwitchFilterItem"
import ButtonFilterItem from "@app/components/common/ButtonFilterItem"
import { defineComponent, PropType, watch } from "vue"
import { Plus } from "@element-plus/icons-vue"
import { t } from "@app/locale"
import { useState } from "@src/hooks/useState"

export type FilterOption = {
    host?: string,
    alias?: string,
    onlyDetected?: boolean,
}

const _default = defineComponent({
    props: {
        defaultValue: Object as PropType<FilterOption>,
    },
    emits: {
        change: (_option: FilterOption) => true,
        create: () => true,
    },
    setup(props, ctx) {
        const defaultOption = props.defaultValue as FilterOption
        const [host, setHost] = useState(defaultOption?.host)
        const [alias, setAlias] = useState(defaultOption?.alias)
        const [onlyDetected, setOnlyDetected] = useState(defaultOption?.onlyDetected || false)

        watch([host, alias, onlyDetected], () => ctx.emit("change", {
            host: host.value,
            alias: alias.value,
            onlyDetected: onlyDetected.value
        }))
        return () => <>
            <InputFilterItem
                placeholder={t(msg => msg.siteManage.hostPlaceholder)}
                onSearch={setHost}
            />
            <InputFilterItem
                placeholder={t(msg => msg.siteManage.aliasPlaceholder)}
                onSearch={setAlias} />
            <SwitchFilterItem
                label={t(msg => msg.siteManage.onlyDetected)}
                defaultValue={onlyDetected.value}
                onChange={setOnlyDetected}
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
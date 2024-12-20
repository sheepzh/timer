/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import ButtonFilterItem from "@app/components/common/ButtonFilterItem"
import InputFilterItem from "@app/components/common/InputFilterItem"
import { t } from "@app/locale"
import { ArrowDown, Connection, Delete, Grid, Plus } from "@element-plus/icons-vue"
import { useState } from "@src/hooks"
import { ElButton, ElDropdown, ElDropdownItem, ElDropdownMenu, ElLink } from "element-plus"
import { defineComponent, PropType, watch } from "vue"
import Flex from "../common/Flex"

export type FilterOption = {
    host?: string,
    alias?: string,
}

const _default = defineComponent({
    props: {
        defaultValue: Object as PropType<FilterOption>,
    },
    emits: {
        change: (_option: FilterOption) => true,
        create: () => true,
        batchDelete: () => true,
        batchChangeCate: () => true,
        batchDisassociate: () => true,
    },
    setup(props, ctx) {
        const defaultOption = props.defaultValue as FilterOption
        const [host, setHost] = useState(defaultOption?.host)
        const [alias, setAlias] = useState(defaultOption?.alias)

        watch([host, alias], () => ctx.emit("change", {
            host: host.value,
            alias: alias.value,
        }))

        return () => <>
            <InputFilterItem
                placeholder={t(msg => msg.siteManage.hostPlaceholder)}
                onSearch={setHost}
            />
            <InputFilterItem
                placeholder={t(msg => msg.siteManage.aliasPlaceholder)}
                onSearch={setAlias} />
            <Flex align="center" class="filter-item-right" gap={3}>
                <ElButton
                    link
                    type="primary"
                    icon={<Grid />}
                    onClick={() => ctx.emit('batchChangeCate')}
                >
                    {t(msg => msg.siteManage.cate.batchChange)}
                </ElButton>
                <ElDropdown v-slots={{
                    default: () => <ElLink type="primary" underline={false} icon={ArrowDown} />,
                    dropdown: () => (
                        <ElDropdownMenu>
                            <ElDropdownItem
                                icon={<Connection />}
                                onClick={() => ctx.emit('batchDisassociate')}
                            >
                                {t(msg => msg.siteManage.cate.batchDisassociate)}
                            </ElDropdownItem>
                            <ElDropdownItem
                                icon={<Delete />}
                                onClick={() => ctx.emit('batchDelete')}
                            >
                                {t(msg => msg.button.batchDelete)}
                            </ElDropdownItem>
                        </ElDropdownMenu>
                    )
                }} />
            </Flex>
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
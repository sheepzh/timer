/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { createTabAfterCurrent } from "@api/chrome/tab"
import ButtonFilterItem from "@app/components/common/filter/ButtonFilterItem"
import InputFilterItem from "@app/components/common/filter/InputFilterItem"
import SwitchFilterItem from "@app/components/common/filter/SwitchFilterItem"
import { t } from "@app/locale"
import { OPTION_ROUTE } from "@app/router/constants"
import { Delete, Open, Operation, Plus, SetUp, TurnOff } from "@element-plus/icons-vue"
import { useState } from "@hooks"
import Flex from "@pages/components/Flex"
import { getAppPageUrl } from "@util/constant/url"
import { defineComponent, watch, type PropType } from "vue"
import DropdownButton, { type DropdownButtonItem } from "../common/DropdownButton"
import type { LimitFilterOption } from "./types"

const optionPageUrl = getAppPageUrl(OPTION_ROUTE, { i: 'dailyLimit' })

type BatchOpt = 'delete' | 'enable' | 'disable'

const _default = defineComponent({
    props: {
        defaultValue: {
            type: Object as PropType<LimitFilterOption>,
            required: true,
        }
    },
    emits: {
        batchDelete: () => true,
        batchEnable: () => true,
        batchDisable: () => true,
        create: () => true,
        change: (_option: LimitFilterOption) => true,
        test: () => true,
    },
    setup(props, ctx) {
        const [url, setUrl] = useState(props.defaultValue.url)
        const [onlyEnabled, setOnlyEnabled] = useState(props.defaultValue?.onlyEnabled)
        watch([url, onlyEnabled], () => ctx.emit("change", { url: url.value, onlyEnabled: onlyEnabled.value }))

        const batchItems: DropdownButtonItem<BatchOpt>[] = [
            {
                key: 'delete',
                label: t(msg => msg.button.batchDelete),
                icon: Delete,
            }, {
                key: 'enable',
                label: t(msg => msg.button.batchEnable),
                icon: Open,
            }, {
                key: 'disable',
                label: t(msg => msg.button.batchDisable),
                icon: TurnOff,
            },
        ]

        const handleBatchClick = (key: BatchOpt) => {
            if (key === 'delete') {
                ctx.emit('batchDelete')
            } else if (key === 'enable') {
                ctx.emit('batchEnable')
            } else if (key === 'disable') {
                ctx.emit('batchDisable')
            }
        }

        return () => (
            <Flex justify="space-between" gap={10}>
                <Flex gap={10}>
                    <InputFilterItem
                        defaultValue={url.value}
                        placeholder={t(msg => msg.limit.item.condition)}
                        onSearch={setUrl}
                    />
                    <SwitchFilterItem
                        historyName="onlyEnabled"
                        label={t(msg => msg.limit.filterDisabled)}
                        defaultValue={onlyEnabled.value}
                        onChange={setOnlyEnabled}
                    />
                </Flex>
                <Flex gap={10}>
                    <DropdownButton items={batchItems} onClick={key => handleBatchClick(key as BatchOpt)} />
                    <ButtonFilterItem
                        text={t(msg => msg.limit.button.test)}
                        type="primary"
                        icon={<Operation />}
                        onClick={() => ctx.emit("test")}
                    />
                    <ButtonFilterItem
                        text={t(msg => msg.base.option)}
                        icon={<SetUp />}
                        type="primary"
                        onClick={() => createTabAfterCurrent(optionPageUrl)}
                    />
                    <ButtonFilterItem
                        text={t(msg => msg.button.create)}
                        type="success"
                        icon={<Plus />}
                        onClick={() => ctx.emit("create")}
                    />
                </Flex>
            </Flex>
        )
    }
})

export default _default
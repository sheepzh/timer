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
import Flex from "@pages/components/Flex"
import { getAppPageUrl } from "@util/constant/url"
import { defineComponent } from "vue"
import DropdownButton, { type DropdownButtonItem } from "../common/DropdownButton"
import { useLimitBatch, useLimitFilter } from "./context"

const optionPageUrl = getAppPageUrl(OPTION_ROUTE, { i: 'dailyLimit' })

type BatchOpt = 'delete' | 'enable' | 'disable'

type Props = {
    onCreate?: NoArgCallback
    onTest?: NoArgCallback
}

const _default = defineComponent((props: Props) => {
    const { onTest, onCreate } = props
    const filter = useLimitFilter()
    const { batchDelete, batchDisable, batchEnable } = useLimitBatch()

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
            batchDelete()
        } else if (key === 'enable') {
            batchEnable()
        } else if (key === 'disable') {
            batchDisable()
        }
    }

    return () => (
        <Flex justify="space-between" gap={10}>
            <Flex gap={10}>
                <InputFilterItem
                    defaultValue={filter.url}
                    placeholder={t(msg => msg.limit.item.condition)}
                    onSearch={val => filter.url = val}
                />
                <SwitchFilterItem
                    historyName="onlyEnabled"
                    label={t(msg => msg.limit.filterDisabled)}
                    defaultValue={filter.onlyEnabled}
                    onChange={val => filter.onlyEnabled = val}
                />
            </Flex>
            <Flex gap={10}>
                <DropdownButton items={batchItems} onClick={key => handleBatchClick(key as BatchOpt)} />
                <ButtonFilterItem
                    text={t(msg => msg.limit.button.test)}
                    type="primary"
                    icon={<Operation />}
                    onClick={onTest}
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
                    onClick={onCreate}
                />
            </Flex>
        </Flex>
    )
}, { props: ['onCreate', 'onTest'] })

export default _default
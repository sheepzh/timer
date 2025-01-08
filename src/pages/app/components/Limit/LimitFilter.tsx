/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { createTabAfterCurrent } from "@api/chrome/tab"
import ButtonFilterItem from "@app/components/common/ButtonFilterItem"
import InputFilterItem from "@app/components/common/InputFilterItem"
import SwitchFilterItem from "@app/components/common/SwitchFilterItem"
import { t } from "@app/locale"
import { OPTION_ROUTE } from "@app/router/constants"
import { Operation, Plus, SetUp } from "@element-plus/icons-vue"
import { useState } from "@hooks"
import { getAppPageUrl } from "@util/constant/url"
import { defineComponent, watch, type PropType } from "vue"
import type { LimitFilterOption } from "./types"

const optionPageUrl = getAppPageUrl(OPTION_ROUTE, { i: 'dailyLimit' })

const _default = defineComponent({
    props: {
        defaultValue: Object as PropType<LimitFilterOption>
    },
    emits: {
        create: () => true,
        change: (_option: LimitFilterOption) => true,
        test: () => true,
    },
    setup(props, ctx) {
        const [url, setUrl] = useState(props.defaultValue?.url)
        const [onlyEnabled, setOnlyEnabled] = useState(props.defaultValue?.onlyEnabled)
        watch([url, onlyEnabled], () => ctx.emit("change", { url: url.value, onlyEnabled: onlyEnabled.value }))
        return () => <>
            <InputFilterItem
                defaultValue={url.value}
                placeholder="URL + ↵"
                onSearch={setUrl}
            />
            <SwitchFilterItem
                historyName="onlyEnabled"
                label={t(msg => msg.limit.filterDisabled)}
                defaultValue={onlyEnabled.value}
                onChange={setOnlyEnabled}
            />
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
        </>
    }
})

export default _default
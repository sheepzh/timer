/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Operation, Plus, SetUp } from "@element-plus/icons-vue"
import { Ref, defineComponent, watch, ref } from "vue"
import InputFilterItem from "@app/components/common/InputFilterItem"
import SwitchFilterItem from "@app/components/common/SwitchFilterItem"
import ButtonFilterItem from "@app/components/common/ButtonFilterItem"
import { t } from "@app/locale"
import { getAppPageUrl } from "@util/constant/url"
import { OPTION_ROUTE } from "@app/router/constants"
import { createTabAfterCurrent } from "@api/chrome/tab"

const optionPageUrl = getAppPageUrl(false, OPTION_ROUTE, { i: 'dailyLimit' })

const _default = defineComponent({
    props: {
        url: String,
        onlyEnabled: Boolean
    },
    emits: {
        create: () => true,
        change: (_url: string, _onlyEnabled: boolean) => true,
        test: () => true,
    },
    setup(props, ctx) {
        const url: Ref<string> = ref(props.url)
        const onlyEnabled: Ref<boolean> = ref(props.onlyEnabled)
        watch([url, onlyEnabled], () => ctx.emit("change", url.value, onlyEnabled.value))
        return () => <>
            <InputFilterItem
                defaultValue={url.value}
                placeholder={t(msg => msg.limit.conditionFilter)}
                onSearch={val => url.value = val}
            />
            <SwitchFilterItem
                historyName="onlyEnabled"
                label={t(msg => msg.limit.filterDisabled)}
                defaultValue={onlyEnabled.value}
                onChange={val => onlyEnabled.value = val}
            />
            <ButtonFilterItem
                text={t(msg => msg.limit.button.test)}
                type="primary"
                icon={<Operation />}
                onClick={() => ctx.emit("test")}
            />
            <ButtonFilterItem
                text={t(msg => msg.limit.button.option)}
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
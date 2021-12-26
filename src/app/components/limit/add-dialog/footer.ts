/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Check } from "@element-plus/icons"
import { ElButton } from "element-plus"
import { defineComponent, h, SetupContext } from "vue"
import { t } from "@app/locale"

const saveButton = (onClick: () => void) => h<{}>(ElButton,
    {
        onClick,
        type: 'primary',
        icon: Check
    },
    () => t(msg => msg.limit.button.save)
)

const _default = defineComponent((_props, context: SetupContext) => {
    const onSave: () => void = (context.attrs.onSave || (() => { })) as () => void
    return () => h('span', {}, [
        saveButton(onSave)
    ])
})

export default _default
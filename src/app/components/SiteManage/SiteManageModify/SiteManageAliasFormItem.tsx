/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { ElFormItem, ElInput } from "element-plus"
import { defineComponent } from "vue"

const _default = defineComponent({
    props: {
        modelValue: String
    },
    emits: {
        input: (_val: string) => true,
        enter: () => true,
    },
    setup(props, ctx) {
        return () => <ElFormItem prop="alias" label={t(msg => msg.siteManage.column.alias)}>
            <ElInput
                modelValue={props.modelValue}
                onInput={val => ctx.emit("input", val.trimStart())}
                onKeydown={(ev: KeyboardEvent) => ev.key === "Enter" && ctx.emit("enter")}
            />
        </ElFormItem>
    }
})

export default _default
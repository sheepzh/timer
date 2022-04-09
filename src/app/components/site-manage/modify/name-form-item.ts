/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { ElFormItem, ElInput } from "element-plus"
import { h, defineComponent } from "vue"

const LABEL = t(msg => msg.siteManage.column.alias)
const _default = defineComponent({
    name: "SiteManageNameFormItem",
    props: {
        modelValue: String
    },
    emits: ["input"],
    setup(props, ctx) {
        return () => h(ElFormItem,
            { prop: 'name', label: LABEL },
            () => h(ElInput, {
                modelValue: props.modelValue,
                onInput: (newVal: string) => ctx.emit("input", newVal.trimStart())
            })
        )
    }
})

export default _default
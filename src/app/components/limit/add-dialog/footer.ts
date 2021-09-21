import { ElButton } from "element-plus"
import { defineComponent, h, SetupContext } from "vue"
import { t } from "../../../locale"

const saveButton = (onClick: () => void) => h<{}>(ElButton,
    {
        onClick,
        type: 'primary',
        icon: 'el-icon-check'
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
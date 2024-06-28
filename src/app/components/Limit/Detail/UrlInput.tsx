import { t } from "@app/locale"
import { ElButton, ElTag } from "element-plus"
import { defineComponent, PropType } from "vue"
import UrlEdit from "./UrlEdit"
import { useSwitch } from "@hooks"

const _default = defineComponent({
    props: {
        modelValue: Array as PropType<string[]>,
    },
    emits: {
        change: (_value: string[]) => true,
    },
    setup(props, ctx) {
        const [editing, openEditing, closeEditing] = useSwitch(false)
        const handleDelete = (idx: number) => {
            const newVal = props.modelValue?.filter?.((_, i) => i !== idx) || []
            ctx.emit('change', newVal)
        }
        const handleSave = (url: string) => {
            closeEditing()
            if (props.modelValue?.includes?.(url)) return
            const newVal = [...props.modelValue || [], url]
            ctx.emit('change', newVal)
        }
        return () => (
            <div class="limit-url-input">
                {props.modelValue?.map((url, idx) => (
                    <ElTag
                        closable
                        onClose={() => handleDelete(idx)}
                    >
                        {url}
                    </ElTag>
                ))}
                <ElButton onClick={openEditing}>
                    {`+ ${t(msg => msg.button.create)}`}
                </ElButton>
                <UrlEdit
                    visible={editing.value}
                    onSave={handleSave}
                    onCancel={closeEditing}
                />
            </div>
        )
    }
})

export default _default
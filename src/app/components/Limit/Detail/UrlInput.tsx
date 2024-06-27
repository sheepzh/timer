import { t } from "@app/locale"
import { ElButton, ElPopover, ElTag } from "element-plus"
import { defineComponent, PropType } from "vue"
import UrlEdit from "./UrlEdit"

const _default = defineComponent({
    props: {
        modelValue: Array as PropType<string[]>,
    },
    emits: {
        change: (_value: string[]) => true,
    },
    setup(props, ctx) {
        const handleDelete = (idx: number) => {
            const newVal = props.modelValue?.filter?.((_, i) => i !== idx) || []
            ctx.emit('change', newVal)
        }
        const handleSave = (url: string) => {
            if (props.modelValue?.includes?.(url)) return
            const newVal = [...props.modelValue || [], url]
            ctx.emit('change', newVal)
        }
        return () => (
            <div>
                {props.modelValue?.map((url, idx) => (
                    <ElTag
                        size="small"
                        closable
                        onClose={() => handleDelete(idx)}
                    >
                        {url}
                    </ElTag>
                ))}
                <ElPopover
                    trigger="click"
                    popperStyle={{ width: '700px' }}
                    v-slots={{
                        reference: () => <ElButton>{`+ ${t(msg => msg.button.create)}`}</ElButton>,
                        default: () => <UrlEdit onSave={handleSave} />,
                    }}
                />
            </div>
        )
    }
})

export default _default
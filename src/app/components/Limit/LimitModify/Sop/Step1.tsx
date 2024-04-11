import { t } from "@app/locale"
import { useShadow } from "@hooks"
import { ElCol, ElForm, ElFormItem, ElInput, ElMessage, ElRow, ElSwitch } from "element-plus"
import { defineComponent, watch } from "vue"
import { StepFromInstance } from "./common"

const _default = defineComponent({
    props: {
        defaultName: String,
        defaultEnabled: Boolean,
    },
    emits: {
        change: (_name: string, _enabled: boolean) => true,
    },
    setup(props, ctx) {
        const [name, setName] = useShadow(() => props.defaultName)
        const [enabled, setEnabled] = useShadow(() => props.defaultEnabled)
        watch([enabled, name], () => ctx.emit("change", name.value, enabled.value))

        const validate = () => {
            if (name.value?.trim?.()) return true
            ElMessage.error("Name is empty")
            return false
        }

        ctx.expose({ validate } satisfies StepFromInstance)
        return () => <div class="sop-footer">
            <ElForm labelWidth={130}>
                <ElRow gutter={10}>
                    <ElCol span={12}>
                        <ElFormItem label={t(msg => msg.limit.item.name)} required>
                            <ElInput
                                size="small"
                                modelValue={name.value}
                                onInput={setName}
                                clearable
                                onClear={() => setName()}
                            />
                        </ElFormItem>
                    </ElCol>
                    <ElCol span={12}>
                        <ElFormItem label={t(msg => msg.limit.item.enabled)} required>
                            <ElSwitch modelValue={enabled.value} onChange={setEnabled} />
                        </ElFormItem>
                    </ElCol>
                </ElRow>
            </ElForm>
        </div>
    }
})

export default _default
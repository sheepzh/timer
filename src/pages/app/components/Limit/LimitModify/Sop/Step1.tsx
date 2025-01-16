import { t } from "@app/locale"
import { useShadow } from "@hooks"
import { ElCol, ElForm, ElFormItem, ElInput, ElMessage, ElOption, ElRow, ElSelect, ElSwitch } from "element-plus"
import { defineComponent, type PropType, watch } from "vue"
import { type StepFromInstance } from "./common"

const _default = defineComponent({
    props: {
        defaultName: String,
        defaultEnabled: Boolean,
        defaultWeekdays: Array as PropType<number[]>,
    },
    emits: {
        change: (_name: string, _enabled: boolean, _weekdays: number[]) => true,
    },
    setup(props, ctx) {
        const [name, setName] = useShadow(() => props.defaultName)
        const [enabled, setEnabled] = useShadow(() => props.defaultEnabled)
        const [weekdays, setWeekdays] = useShadow(() => props.defaultWeekdays)
        watch([enabled, name, weekdays], () => ctx.emit("change", name.value, enabled.value, weekdays.value))

        const validate = () => {
            const nameVal = name.value?.trim?.()
            const weekdaysVal = weekdays.value
            if (!nameVal) {
                ElMessage.error("Name is empty")
                return false
            } if (!weekdaysVal?.length) {
                ElMessage.error("Effective days are empty")
                return false
            }
            return true
        }

        ctx.expose({ validate } satisfies StepFromInstance)
        return () => <div class="sop-footer">
            <ElForm labelWidth={130} labelPosition="left">
                <ElRow gutter={30}>
                    <ElCol span={12}>
                        <ElFormItem label={t(msg => msg.limit.item.name)} required>
                            <ElInput
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
                <ElRow>
                    <ElCol span={24}>
                        <ElFormItem label={t(msg => msg.limit.item.effectiveDay)} required>
                            <ElSelect
                                multiple
                                modelValue={weekdays.value}
                                onChange={setWeekdays}
                                placeholder=""
                            >
                                {t(msg => msg.calendar.weekDays).split('|').map((weekDay, idx) => <ElOption value={idx} label={weekDay} />)}
                            </ElSelect>
                        </ElFormItem>
                    </ElCol>
                </ElRow>
            </ElForm>
        </div>
    }
})

export default _default
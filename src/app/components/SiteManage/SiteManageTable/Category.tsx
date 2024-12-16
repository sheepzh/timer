import Flex from "@app/components/common/Flex"
import { t } from "@app/locale"
import { Check, Close, Edit, Plus } from "@element-plus/icons-vue"
import { useRequest, useSwitch } from "@hooks"
import siteService from "@service/site-service"
import { ElButton, ElColorPicker, ElForm, ElFormItem, ElIcon, ElInput, ElSelect, ElTag } from "element-plus"
import { computed, defineComponent } from "vue"

const SelectFooter = defineComponent({
    setup() {
        const [editing, openEditing, closeEditing] = useSwitch(false)
        return () => (
            <Flex direction="column">
                {editing.value ? <>
                    <ElForm size="small" labelPosition="right" labelWidth={60}>
                        <ElFormItem label={t(msg => msg.siteManage.cate.name)} required>
                            <ElInput size="small" />
                        </ElFormItem>
                        <ElFormItem label={t(msg => msg.siteManage.cate.color)}>
                            <ElColorPicker size="small" />
                        </ElFormItem>
                    </ElForm>
                    <Flex width="100%" justify="end">
                        <ElButton
                            size="small"
                            icon={<Close />}
                            onClick={closeEditing}
                        >
                            {t(msg => msg.button.cancel)}
                        </ElButton>
                        <ElButton size="small" type="primary" icon={<Check />}>
                            {t(msg => msg.button.confirm)}
                        </ElButton>
                    </Flex>
                </> : (
                    <Flex width="100%" justify="end">
                        <ElButton size="small" icon={<Plus />} type="success" onClick={openEditing}>
                            {t(msg => msg.button.create)}
                        </ElButton>
                    </Flex>
                )}
            </Flex>
        )
    }
})

const _default = defineComponent({
    props: {
        modelValue: Number
    },
    setup(props) {
        const { data: categories } = useRequest(() => siteService.listAllCategories())
        const [editing, _1, _2, toggleEditing] = useSwitch(true)

        const current = computed(() => {
            const id = props.modelValue
            if (!id || !categories.value?.length) return null
            return categories.value?.find(c => c.id === id)
        })

        return () => {
            if (!editing.value) {
                return <div>
                    {current.value && <ElTag color={current.value.color}>{current.value.label}</ElTag>}
                    <span onClick={toggleEditing}>
                        <ElIcon style={{ cursor: 'pointer' }}>
                            <Edit />
                        </ElIcon>
                    </span>
                </div>
            } else {
                return <ElSelect
                    size="small"
                    v-slots={{
                        default: () => <div>
                            {/* <ElOption></ElOption> */}
                        </div>,
                        footer: () => <SelectFooter />
                    }}
                />
            }
        }
    },
})

export default _default
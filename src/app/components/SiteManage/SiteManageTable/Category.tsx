import Flex from "@app/components/common/Flex"
import { t } from "@app/locale"
import { Check, Close, Edit, Plus, Remove } from "@element-plus/icons-vue"
import { useRequest, useState, useSwitch } from "@hooks"
import siteService from "@service/site-service"
import { ElButton, ElColorPicker, ElForm, ElFormItem, ElIcon, ElInput, ElMessage, ElOption, ElSelect, ElTag, ElText } from "element-plus"
import { computed, defineComponent } from "vue"

const SelectFooter = defineComponent({
    emits: {
        create: () => true
    },
    setup(_, ctx) {
        const [editing, openEditing, closeEditing] = useSwitch(false)
        const [name, setName] = useState<string>()
        const [color, setColor] = useState<string>()

        const { refresh: saveCate, loading } = useRequest(
            (name: string, color?: string) => siteService.addCategory({ name, color }),
            {
                onSuccess() {
                    ctx.emit('create')
                    closeEditing()
                    setName()
                    setColor()
                }
            }
        )

        const onConfirm = () => {
            let nameVal = name?.value?.trim?.()
            if (!nameVal) {
                ElMessage.warning("Name is empty")
                return
            }
            saveCate(nameVal, color.value?.trim?.())
        }

        return () => (
            <Flex direction="column">
                {editing.value ? <>
                    <ElForm
                        size="small"
                        labelPosition="right"
                        labelWidth={60}
                        disabled={loading.value}
                    >
                        <ElFormItem label={t(msg => msg.siteManage.cate.name)} required>
                            <ElInput
                                size="small"
                                modelValue={name.value}
                                onInput={setName}
                            />
                        </ElFormItem>
                        <ElFormItem label={t(msg => msg.siteManage.cate.color)}>
                            <ElColorPicker
                                size="small"
                                modelValue={color.value}
                                onChange={setColor}
                                teleported={false}
                            />
                        </ElFormItem>
                    </ElForm>
                    <Flex width="100%" justify="end">
                        <ElButton
                            size="small"
                            disabled={loading.value}
                            icon={<Close />}
                            onClick={closeEditing}
                        >
                            {t(msg => msg.button.cancel)}
                        </ElButton>
                        <ElButton
                            size="small"
                            type="primary"
                            icon={<Check />}
                            onClick={onConfirm}
                            loading={loading.value}
                        >
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
        const { data: categories, refresh } = useRequest(() => siteService.listAllCategories())
        const [editing, _1, _2, toggleEditing] = useSwitch(true)

        const current = computed(() => {
            const id = props.modelValue
            if (!id || !categories.value?.length) return null
            return categories.value?.find(c => c.id === id)
        })

        return () => {
            if (!editing.value) {
                return <div>
                    {current.value && <ElTag color={current.value.color}>{current.value.name}</ElTag>}
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
                        footer: () => <SelectFooter onCreate={refresh} />
                    }}
                >
                    {
                        categories.value?.map(c => (
                            <ElOption value={c.id}>
                                <Flex justify="space-between" width='100%' align="center">
                                    <ElTag color={c.color} size="small">
                                        {c.name}
                                    </ElTag>
                                    <Flex>
                                        <ElText><Edit /></ElText>
                                        <ElText><Remove /></ElText>
                                    </Flex>
                                </Flex>
                            </ElOption>
                        ))
                    }
                </ElSelect>
            }
        }
    },
})

export default _default
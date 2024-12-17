import Flex from "@app/components/common/Flex"
import { t } from "@app/locale"
import { Check, Close, Delete, Edit, Plus } from "@element-plus/icons-vue"
import { useManualRequest, useRequest, useState, useSwitch } from "@hooks"
import cateService from "@service/cate-service"
import siteService from "@service/site-service"
import { ElButton, ElForm, ElFormItem, ElIcon, ElInput, ElMessage, ElMessageBox, ElOption, ElPopconfirm, ElPopover, ElSelect, ElTag } from "element-plus"
import { computed, defineComponent, nextTick, PropType, ref } from "vue"

const SelectFooter = defineComponent({
    emits: {
        create: () => true
    },
    setup(_, ctx) {
        const [editing, openEditing, closeEditing] = useSwitch(false)
        const [name, setName] = useState<string>()

        const { refresh: saveCate, loading } = useManualRequest(
            (name: string) => cateService.addCategory(name),
            {
                onSuccess() {
                    ctx.emit('create')
                    closeEditing()
                    setName()
                }
            }
        )

        const onConfirm = () => {
            let nameVal = name?.value?.trim?.()
            if (!nameVal) {
                ElMessage.warning("Name is empty")
                return
            }
            saveCate(nameVal)
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

const OptionItem = defineComponent({
    props: {
        value: Object as PropType<timer.site.Cate>,
    },
    emits: {
        change: () => true,
    },
    setup(props, ctx) {
        const [editing, openEditing, closeEditing] = useSwitch(false)
        const [editingName, setEditingName] = useState(props.value.name)
        const inputRef = ref<HTMLInputElement>()

        const { refresh: saveCate, loading: saving } = useManualRequest(
            (name: string) => cateService.saveCategory(props.value.id, name),
            {
                onSuccess() {
                    ctx.emit('change')
                    closeEditing()
                }
            }
        )
        const { data: relatedSites, loading: queryingSites } = useRequest(() => siteService.selectAll({ cateIds: props.value?.id }))

        const onSaveClick = (e: MouseEvent) => {
            const name = editingName.value?.trim?.()
            if (!name) {
                ElMessage.warning("Name is blank")
                return
            }
            saveCate(name)
        }

        const onRemoveClick = (e: MouseEvent) => {
            e.stopPropagation()

            const siteCount = relatedSites.value?.length ?? 0
            if (siteCount) {
                ElMessage.warning(t(msg => msg.siteManage.cate.relatedMsg, { siteCount }))
                return
            }
            ElMessageBox.confirm('123', {
                closeOnClickModal: false,
            })
                .then(() => { })
                .catch(() => { })
        }

        return () => (
            <Flex
                justify="space-between" align="center" gap={5}
                width='100%' height='100%'
                onClick={ev => editing.value && ev.stopPropagation()}
            >
                {editing.value ? <>
                    <Flex flex={1}>
                        <ElInput
                            ref={inputRef}
                            size="small"
                            modelValue={editingName.value}
                            onInput={setEditingName}
                            style={{ maxWidth: '120px' }}
                        />
                    </Flex>
                    <Flex>
                        <ElButton
                            size="small"
                            link
                            icon={<Close />}
                            type="info"
                            onClick={ev => {
                                closeEditing()
                                ev.stopPropagation()
                            }}
                        />
                        <ElButton
                            size="small"
                            link
                            icon={<Check />}
                            type="primary"
                            onClick={onSaveClick}
                        />
                    </Flex>
                </> : <>
                    <Flex flex={1}>{props.value.name}</Flex>
                    <Flex>
                        <ElButton
                            size="small"
                            link
                            icon={<Edit />}
                            type="primary"
                            onClick={e => {
                                setEditingName(props.value.name)
                                openEditing()
                                nextTick(() => inputRef.value?.focus?.())
                                e.stopPropagation()
                            }}
                        />
                        <ElButton
                            size="small"
                            link
                            icon={<Delete />}
                            type="danger"
                            disabled={queryingSites.value}
                            onClick={onRemoveClick}
                        />
                    </Flex>
                </>}
            </Flex>
        )
    },
})

const _default = defineComponent({
    props: {
        modelValue: Number
    },
    setup(props) {
        const { data: categories, refresh } = useRequest(() => cateService.listAllCategories())
        const [editing, _1, _2, toggleEditing] = useSwitch(true)

        const current = computed(() => {
            const id = props.modelValue
            if (!id || !categories.value?.length) return null
            return categories.value?.find(c => c.id === id)
        })

        return () => {
            if (!editing.value) {
                return <div>
                    {current.value && <ElTag>{current.value.name}</ElTag>}
                    <span onClick={toggleEditing}>
                        <ElIcon style={{ cursor: 'pointer' }}>
                            <Edit />
                        </ElIcon>
                    </span>
                </div >
            } else {
                return <ElSelect
                    size="small"
                    v-slots={{
                        footer: () => <SelectFooter onCreate={refresh} />
                    }}
                >
                    {categories.value?.map(c => (
                        <ElOption value={c.id}>
                            <OptionItem value={c} onChange={refresh} />
                        </ElOption>
                    ))}
                </ElSelect>
            }
        }
    },
})

export default _default
import { useCategories } from "@app/context"
import { t } from "@app/locale"
import { Check, Close, Delete, Edit } from "@element-plus/icons-vue"
import { useManualRequest, useRequest, useState, useSwitch } from "@hooks"
import Flex from "@pages/components/Flex"
import cateService from "@service/cate-service"
import siteService from "@service/site-service"
import { stopPropagationAfter } from "@util/document"
import { ElButton, ElInput, ElMessage, ElMessageBox } from "element-plus"
import { defineComponent, nextTick, type PropType, ref } from "vue"

const OptionItem = defineComponent({
    props: {
        value: Object as PropType<timer.site.Cate>,
    },
    setup(props) {
        const { refreshCategories } = useCategories()

        const [editing, openEditing, closeEditing] = useSwitch(false)
        const [editingName, setEditingName] = useState(props.value.name)
        const inputRef = ref<HTMLInputElement>()

        const { refresh: saveCate } = useManualRequest(
            (name: string) => cateService.saveName(props.value.id, name),
            {
                onSuccess() {
                    refreshCategories()
                    closeEditing()
                }
            }
        )

        const onSaveClick = () => {
            const name = editingName.value?.trim?.()
            if (!name) {
                ElMessage.warning("Name is blank")
                return
            }
            saveCate(name)
        }

        const { refresh: removeCate } = useManualRequest(
            () => cateService.remove(props.value.id),
            {
                onSuccess: () => {
                    refreshCategories()
                    ElMessage.success(t(msg => msg.operation.successMsg))
                },
            }
        )
        const { data: relatedSites, loading: queryingSites } = useRequest(() => siteService.selectAll({ cateIds: props.value?.id }))

        const onRemoveClick = (e: MouseEvent) => {
            e.stopPropagation()

            const siteCount = relatedSites.value?.length ?? 0
            if (siteCount) {
                ElMessage.warning(t(msg => msg.siteManage.cate.relatedMsg, { siteCount }))
                return
            }
            ElMessageBox.confirm('', {
                message: t(msg => msg.siteManage.cate.removeConfirm, { category: props.value?.name }),
                type: 'warning',
                closeOnClickModal: false,
            }).then(removeCate).catch(() => { })
        }

        const onEditClick = () => {
            setEditingName(props.value.name)
            openEditing()
            nextTick(() => inputRef.value?.focus?.())
        }

        return () => (
            <Flex
                key={`${editing.value}`}
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
                            onKeydown={(ev: KeyboardEvent) => {
                                const { key } = ev
                                if (key === 'Enter') {
                                    onSaveClick()
                                } else if (key === 'Escape') {
                                    stopPropagationAfter(ev, closeEditing)
                                }
                            }}
                        />
                    </Flex>
                    <Flex>
                        <ElButton
                            size="small"
                            link
                            icon={<Close />}
                            type="info"
                            onClick={ev => stopPropagationAfter(ev, closeEditing)}
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
                            onClick={e => stopPropagationAfter(e, onEditClick)}
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

export default OptionItem
import Flex from "@src/pages/components/Flex"
import { useCategories } from "@app/context"
import { Edit } from "@element-plus/icons-vue"
import { useSwitch } from "@hooks"
import siteService from "@service/site-service"
import { ElIcon, ElTag } from "element-plus"
import { computed, defineComponent, nextTick, PropType, ref } from "vue"
import CategorySelect, { CategorySelectInstance } from "../CategorySelect"

const _default = defineComponent({
    props: {
        modelValue: Object as PropType<timer.site.SiteInfo>
    },
    emits: {
        change: (_val: number) => true,
    },
    setup(props, ctx) {
        const { categories } = useCategories()
        const [editing, openEditing, closeEditing] = useSwitch()

        const current = computed(() => {
            const id = props.modelValue?.cate
            if (!id || !categories.value?.length) return null
            return categories.value?.find(c => c.id == id)
        })

        const saveSiteCate = (cateId: number | string) => {
            const realCateId = typeof cateId === 'string' ? parseInt(cateId) : cateId
            siteService.saveCate(props.modelValue, realCateId)
                .then(() => {
                    closeEditing()
                    ctx.emit('change', realCateId)
                })
                .catch(() => { })
        }


        const handleEditClick = () => {
            openEditing()
            nextTick(() => selectRef.value?.openOptions?.())
        }

        const selectRef = ref<CategorySelectInstance>()

        return () =>
            <Flex width="100%" height="100%" justify="center">
                {editing.value ?
                    <CategorySelect
                        ref={selectRef}
                        size="small"
                        width="100px"
                        modelValue={props.modelValue?.cate}
                        onChange={saveSiteCate}
                        onVisibleChange={visible => !visible && closeEditing()}
                    />
                    :
                    <Flex align="center" gap={5} height="100%">
                        {current.value &&
                            <ElTag
                                size="small"
                                closable
                                onClose={() => saveSiteCate(undefined)}
                            >
                                {current.value.name}
                            </ElTag>
                        }
                        <Flex align="center" onClick={handleEditClick}>
                            <ElIcon style={{ cursor: 'pointer' }}>
                                <Edit />
                            </ElIcon>
                        </Flex>
                    </Flex >
                }
            </Flex>
    },
})

export default _default
import { useCategories } from "@app/context"
import { Edit } from "@element-plus/icons-vue"
import { useManualRequest, useSwitch } from "@hooks"
import Flex from "@pages/components/Flex"
import siteService from "@service/site-service"
import { supportCategory } from "@util/site"
import { ElIcon, ElTag } from "element-plus"
import { computed, defineComponent, nextTick, type PropType, ref } from "vue"
import CategorySelect, { CategorySelectInstance } from "./CategorySelect"

const CategoryEditable = defineComponent({
    props: {
        siteKey: {
            type: Object as PropType<timer.site.SiteKey>,
            required: true,
        },
        cateId: Number,
    },
    emits: {
        change: (_val: number) => true,
    },
    setup(props, ctx) {
        const { categories } = useCategories()
        const [editing, openEditing, closeEditing] = useSwitch()

        const current = computed(() => {
            const id = props.cateId
            if (!id || !categories.value?.length) return null
            return categories.value?.find(c => c.id == id)
        })

        const { refresh: saveSiteCate } = useManualRequest(async (cateId: number | string) => {
            const realCateId = typeof cateId === 'string' ? parseInt(cateId) : cateId
            await siteService.saveCate(props.siteKey, realCateId)
            return realCateId
        }, {
            onSuccess(realCateId) {
                closeEditing()
                ctx.emit('change', realCateId)
            },
        })

        const handleEditClick = () => {
            openEditing()
            nextTick(() => selectRef.value?.openOptions?.())
        }

        const selectRef = ref<CategorySelectInstance>()

        return () => supportCategory(props.siteKey) ?
            <Flex width="100%" height="100%" justify="center">
                {editing.value ?
                    <CategorySelect
                        ref={selectRef}
                        size="small"
                        width="100px"
                        modelValue={props.cateId}
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
            : false
    },
})

export default CategoryEditable
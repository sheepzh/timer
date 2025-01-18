import { useCategories } from "@app/context"
import { t } from "@app/locale"
import { CATE_NOT_SET_ID } from "@util/site"
import { ElOption, ElSelect } from "element-plus"
import { computed, defineComponent, type PropType, type StyleValue } from "vue"

const CategoryFilter = defineComponent({
    props: {
        modelValue: Array as PropType<number[]>,
        disabled: Boolean,
        useCache: Boolean,
    },
    emits: {
        change: (_val?: number[]) => true,
    },
    setup(props, ctx) {
        const { categories } = useCategories()

        const displayCategories = computed(() => [
            { id: CATE_NOT_SET_ID, name: t(msg => msg.shared.cate.notSet) } satisfies timer.site.Cate,
            ...categories.value || [],
        ])

        const emitChange = (val?: number[]) => ctx.emit('change', val)

        return () => (
            <ElSelect
                modelValue={props.modelValue}
                onChange={(val: number[]) => emitChange(val)}
                multiple
                clearable
                filterable
                collapseTags
                disabled={props.disabled}
                onClear={() => emitChange()}
                placeholder={t(msg => msg.siteManage.column.cate)}
                style={{ width: '200px' } satisfies StyleValue}
            >
                {displayCategories.value?.map(cate => <ElOption value={cate.id} label={cate.name} />)}
            </ElSelect>
        )
    },
})

export default CategoryFilter
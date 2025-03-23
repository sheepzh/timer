import { t } from "@app/locale"
import { useCached } from "@hooks"
import Flex from "@pages/components/Flex"
import { ALL_MERGE_METHODS, processNewMethod } from "@util/merge"
import { type CheckboxValueType, ElCheckboxButton, ElCheckboxGroup, ElText } from "element-plus"
import { defineComponent, type PropType, watch } from "vue"
import "./merge-filter-item.sass"

const MergeFilterItem = defineComponent({
    props: {
        defaultValue: Array as PropType<timer.stat.MergeMethod[]>,
        hideCate: Boolean,
    },
    emits: {
        change: (_val: timer.stat.MergeMethod[]) => true,
    },
    setup(props, ctx) {
        const { data, setter } = useCached('__filter_item_report_merge_method', props.defaultValue, true)
        watch(data, () => ctx.emit('change', data.value || []))

        const handleChange = (val: CheckboxValueType[]) => {
            const methods = processNewMethod(data.value, val as timer.stat.MergeMethod[])
            setter?.(methods)
        }

        return () => (
            <Flex gap={9} class="merge-filter-item">
                <ElText tag="b" type="info">
                    {t(msg => msg.shared.merge.mergeBy)}
                </ElText>
                <ElCheckboxGroup modelValue={data.value} onChange={handleChange}>
                    {ALL_MERGE_METHODS.filter(m => m !== 'cate' || !props.hideCate).map(method => (
                        <ElCheckboxButton value={method}>
                            {t(msg => msg.shared.merge.mergeMethod[method])}
                        </ElCheckboxButton>
                    ))}
                </ElCheckboxGroup>
            </Flex>
        )
    },
})

export default MergeFilterItem
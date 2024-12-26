import Flex from "@app/components/common/Flex"
import { t } from "@app/locale"
import { useCached } from "@hooks/index"
import { ElCheckboxButton, ElCheckboxGroup, ElText } from "element-plus"
import { defineComponent, PropType, watch } from "vue"
import { MergeMethod } from "../common"

const MERGE_METHODS: MergeMethod[] = ['date', 'domain', 'cate']

function judgeAdded(target: MergeMethod, newVal: MergeMethod[], oldVal: MergeMethod[]): boolean {
    return newVal?.includes?.(target) && !oldVal?.includes?.(target)
}

const MergeFilterItem = defineComponent({
    props: {
        defaultValue: Array as PropType<MergeMethod[]>,
        hideCate: Boolean,
    },
    emits: {
        change: (_val: MergeMethod[]) => true,
    },
    setup(props, ctx) {
        const { data, setter } = useCached('__filter_item_report_merge_method', props.defaultValue)
        watch(data, () => ctx.emit('change', data.value || []))

        const handleChange = (newVal: MergeMethod[]) => {
            const oldVal = data.value || []
            if (judgeAdded('cate', newVal, oldVal)) {
                // Add cate, so remove domain
                newVal = newVal.filter?.(v => v !== 'domain')
            }
            if (judgeAdded('domain', newVal, oldVal)) {
                // Add domain, so remove cate
                newVal = newVal.filter?.(v => v !== 'cate')
            }
            setter?.(newVal)
        }

        return () => (
            <Flex gap={9} class="merge-filter-item-wrapper">
                <ElText>{t(msg => msg.report.mergeBy)}</ElText>
                <ElCheckboxGroup modelValue={data.value} onChange={handleChange}>
                    {MERGE_METHODS.filter(m => m !== 'cate' || !props.hideCate).map(method => (
                        <ElCheckboxButton value={method}>
                            {t(msg => msg.report.mergeMethod[method])}
                        </ElCheckboxButton>
                    ))}
                </ElCheckboxGroup>
            </Flex>
        )
    },
})

export default MergeFilterItem
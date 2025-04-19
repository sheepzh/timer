import { t } from "@app/locale"
import Flex from "@pages/components/Flex"
import { ALL_MERGE_METHODS } from "@util/merge"
import { ElCheckboxButton, ElCheckboxGroup, ElText } from "element-plus"
import { computed, defineComponent } from "vue"
import { useReportFilter } from "../context"
import type { ReportFilterOption } from "../types"
import "./merge-filter-item.sass"

const MergeFilterItem = defineComponent<{ hideCate?: boolean }>(props => {
    const filter = useReportFilter()
    const mergeMethod = computed({
        get: () => {
            const { mergeDate, siteMerge } = filter
            const res: timer.stat.MergeMethod[] = []
            mergeDate && (res.push('date'))
            siteMerge && (res.push(siteMerge))
            return res
        },
        set: val => {
            filter.mergeDate = val.includes('date')
            const oldSiteMerge = filter.siteMerge
            const newSiteMerge = (['cate', 'domain'] satisfies ReportFilterOption['siteMerge'][])
                .filter(t => val.includes(t))
                .sort(t => oldSiteMerge?.includes(t) ? 1 : -1)[0]
            filter.siteMerge = newSiteMerge
            newSiteMerge === 'domain' && oldSiteMerge !== 'domain' && (filter.cateIds = [])
        }
    })

    return () => (
        <Flex gap={9} class="merge-filter-item">
            <ElText tag="b" type="info">
                {t(msg => msg.shared.merge.mergeBy)}
            </ElText>
            <ElCheckboxGroup
                modelValue={mergeMethod.value}
                onChange={val => mergeMethod.value = val as timer.stat.MergeMethod[]}
            >
                {ALL_MERGE_METHODS.filter(m => m !== 'cate' || !props.hideCate).map(method => (
                    <ElCheckboxButton value={method}>
                        {t(msg => msg.shared.merge.mergeMethod[method])}
                    </ElCheckboxButton>
                ))}
            </ElCheckboxGroup>
        </Flex >
    )
}, { props: ['hideCate'] })

export default MergeFilterItem
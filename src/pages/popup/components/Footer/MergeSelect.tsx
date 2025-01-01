import { useState } from "@hooks/useState"
import { t } from "@popup/locale"
import { ALL_MERGE_METHODS, processNewMethod } from "@util/merge"
import { ElOption, ElSelect } from "element-plus"
import { defineComponent } from "vue"

const MergeSelect = defineComponent(() => {
    const [data, setData] = useState<timer.stat.MergeMethod[]>([])

    return () => (
        <ElSelect
            modelValue={data.value}
            onChange={newVal => {
                console.log(data.value, newVal)
                newVal = processNewMethod(data.value, newVal)
                console.log(newVal)
                setData(newVal)
            }}
            multiple
            collapseTags
            collapseTagsTooltip
            placeholder={t(msg => msg.merge.mergeBy)}
            style={{ width: '140px' }}
        >
            {ALL_MERGE_METHODS.map(method => (
                <ElOption value={method} label={t(msg => msg.merge.mergeMethod[method])} />
            ))}
        </ElSelect >
    )
})

export default MergeSelect
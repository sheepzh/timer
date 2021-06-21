import { ElInput } from "element-plus"
import { Ref, h } from "vue"
import { t } from "../../../locale"
import { QueryData } from "../contants"

export type HostFilterItemProps = {
    hostRef: Ref<string>
    queryData: QueryData
}
const host = ({ hostRef, queryData }: HostFilterItemProps) => h(ElInput,
    {
        placeholder: t(msg => msg.report.hostPlaceholder),
        clearable: true,
        modelValue: hostRef.value,
        class: 'filter-item',
        onInput: (val: string) => hostRef.value = val.trim(),
        onClear: () => hostRef.value = '',
        onKeyup: (event: KeyboardEvent) => event.key === 'Enter' && queryData()
    }
)

export default host
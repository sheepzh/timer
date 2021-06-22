

import { ElSwitch } from "element-plus"
import { Ref, h } from "vue"
import { t } from "../../../locale"
import { ReportMessage } from "../../../locale/components/report"
import { QueryData } from "../contants"

export type SwitchFilterItemProps = {
    queryData: QueryData
    filterValRef: Ref<boolean>
    itemTitle: keyof ReportMessage
}

const name = (itemTitle: keyof ReportMessage) => h('a', { class: 'filter-name' }, t(msg => msg.report[itemTitle]))

const handleChange = (props: SwitchFilterItemProps, newVal: boolean) => {
    props.filterValRef.value = newVal
    props.queryData()
}

const elSwitch = (props: SwitchFilterItemProps) => h(ElSwitch,
    {
        class: 'filter-item',
        modelValue: props.filterValRef.value,
        onChange: (val: boolean) => handleChange(props, val)
    }
)

export default (props: SwitchFilterItemProps) => [name(props.itemTitle), elSwitch(props)]
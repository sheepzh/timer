import { ElSelect, useNamespace } from "element-plus"
import { defineComponent } from "vue"
import { type TopKFilterOption, useTopKFilter } from "../context"

type Props = {
    field: keyof TopKFilterOption & ('topK' | 'dayNum')
    values: number[]
}

const TitleSelect = defineComponent<Props>(({ values, field }) => {
    const filter = useTopKFilter()
    const ns = useNamespace('title-select')

    return () => (
        <ElSelect
            class={ns.b()}
            size="small"
            modelValue={filter[field]}
            onChange={val => filter[field] = val as number}
            popperOptions={{ placement: 'bottom' }}
            popperClass={ns.e('popper')}
        >
            {values.map(k => <ElSelect.Option key={k} label={k} value={k} />)}
        </ElSelect >
    )
}, { props: ['field', "values"] })

export default TitleSelect
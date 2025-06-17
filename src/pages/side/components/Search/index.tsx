import { Search } from "@element-plus/icons-vue"
import { useState } from "@hooks"
import Flex from "@pages/components/Flex"
import { getDatePickerIconSlots } from "@pages/element-ui/rtl"
import { t } from "@side/locale"
import { ElDatePicker, ElInput } from "element-plus"
import { defineComponent, watch } from "vue"
import "./search.sass"

type Props = {
    defaultDate: Date
    defaultQuery: string
    onSearch?: (query: string, date: Date) => void
}

const _default = defineComponent<Props>(props => {
    const now = Date.now()

    const [query, setQuery] = useState(props.defaultQuery)
    const [date, setDate] = useState(props.defaultDate)
    const handleSearch = () => props.onSearch?.(query.value.trim(), date.value)

    watch(date, handleSearch)

    return () => (
        <Flex>
            <ElInput
                class="search"
                placeholder={t(msg => msg.list.searchPlaceholder)}
                prefixIcon={Search}
                modelValue={query.value}
                onInput={setQuery}
                clearable
                onClear={() => {
                    setQuery('')
                    handleSearch()
                }}
                onKeydown={kv => (kv as KeyboardEvent).code === 'Enter' && handleSearch()}
            />
            <ElDatePicker
                clearable={false}
                disabledDate={(date: Date) => date.getTime() > now}
                modelValue={date.value}
                onUpdate:modelValue={setDate}
                class="search-calendar"
                v-slots={getDatePickerIconSlots()}
            />
        </Flex>
    )
}, { props: ['defaultDate', 'defaultQuery', 'onSearch'] })

export default _default
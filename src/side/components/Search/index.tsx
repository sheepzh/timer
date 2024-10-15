import { Search } from "@element-plus/icons-vue"
import { useState } from "@hooks"
import { t } from "@side/locale"
import { getDatePickerIconSlots } from "@src/element-ui/rtl"
import { ElDatePicker, ElInput } from "element-plus"
import { type PropType, defineComponent, watch } from "vue"
import "./search.sass"

const _default = defineComponent({
    props: {
        defaultDate: Object as PropType<Date>,
        defaultQuery: String,
    },
    emits: {
        search: (_query: string, _date: Date) => true
    },
    setup(props, ctx) {
        const now = Date.now()

        const [query, setQuery] = useState(props.defaultQuery)
        const [date, setDate] = useState<Date>(props.defaultDate)
        const handleSearch = () => ctx.emit("search", query.value?.trim?.(), date.value)

        watch(date, handleSearch)
        return () => (
            <div style={{ display: "flex" }}>
                <ElInput
                    class="search"
                    placeholder={t(msg => msg.list.searchPlaceholder)}
                    prefixIcon={<Search />}
                    modelValue={query.value}
                    onInput={setQuery}
                    clearable
                    onClear={() => {
                        setQuery('')
                        handleSearch()
                    }}
                    onKeydown={(kv: KeyboardEvent) => kv.code === 'Enter' && handleSearch()}
                />
                <ElDatePicker
                    clearable={false}
                    disabledDate={(date: Date) => date.getTime() > now}
                    modelValue={date.value}
                    onUpdate:modelValue={setDate}
                    class="search-calendar"
                    v-slots={getDatePickerIconSlots()}
                />
            </div>
        )
    }
})

export default _default
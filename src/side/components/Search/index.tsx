import { Search } from "@element-plus/icons-vue"
import { ElDatePicker, ElInput } from "element-plus"
import { type PropType, defineComponent, ref, watch } from "vue"
import "./search.sass"
import { t } from "@side/locale"

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

        const query = ref<string>(props.defaultQuery)
        const date = ref<Date>(props.defaultDate)
        const handleSearch = () => ctx.emit("search", query.value?.trim?.(), date.value)

        watch(date, handleSearch)
        return () => (
            <div style={{ display: "flex" }}>
                <ElInput
                    class="search"
                    placeholder={t(msg => msg.list.searchPlaceholder)}
                    prefixIcon={<Search />}
                    modelValue={query.value}
                    onInput={val => query.value = val}
                    clearable
                    onClear={() => {
                        query.value = ''
                        handleSearch()
                    }}
                    onKeydown={(kv: KeyboardEvent) => kv.code === 'Enter' && handleSearch()}
                />
                <ElDatePicker
                    clearable={false}
                    disabledDate={(date: Date) => date.getTime() > now}
                    modelValue={date.value}
                    onUpdate:modelValue={val => date.value = val}
                    class="search-calendar"
                />
            </div>
        )
    }
})

export default _default
import { useRequest } from "@hooks"
import statService, { type StatQueryParam } from "@service/stat-service"
import { formatTime } from "@util/time"
import { ElText } from "element-plus"
import { defineComponent, ref, type StyleValue } from "vue"
import RowList from "./components/RowList"
import Search from "./components/Search"
import { t } from "./locale"

const _default = defineComponent(() => {
    const date = ref(new Date())
    const query = ref('')

    const { data, refresh, loading } = useRequest(() => {
        const statParam: StatQueryParam = {
            date: date.value || new Date(),
            host: query.value,
            exclusiveVirtual: true,
            sort: "focus",
            sortOrder: "DESC",
        }
        return statService.select(statParam, true)
    })

    return () => <div class="main">
        <Search
            defaultQuery={query.value}
            defaultDate={date.value}
            onSearch={(newQuery, newDate) => {
                query.value = newQuery
                date.value = newDate
                // Force refresh
                refresh()
            }}
        />
        <div class="title">
            <ElText>
                {t(msg => msg.list.title)}
            </ElText>
            &emsp;
            <ElText size="small">
                @{formatTime(date.value, t(msg => msg.calendar.dateFormat))}
            </ElText>
        </div>
        <RowList
            loading={loading.value}
            data={data.value ?? []}
            style={{ flex: 1, overflow: "auto" } satisfies StyleValue}
        />
    </div>
})

export default _default
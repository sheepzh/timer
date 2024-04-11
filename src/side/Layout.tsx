import { defineComponent, ref } from "vue"
import Search from "./components/Search"
import { useRequest } from "@hooks"
import RowList from "./components/RowList"
import statService, { StatQueryParam } from "@service/stat-service"
import { ElText } from "element-plus"
import { t } from "./locale"
import { formatTime } from "@util/time"

const _default = defineComponent(() => {
    const date = ref(new Date())
    const query = ref<string>()

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
        <RowList loading={loading.value} data={data.value} style={{ flex: 1, overflow: "auto" }} />
    </div>
})

export default _default
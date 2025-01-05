import { useRequest } from "@hooks/useRequest"
import { jump2Report } from "@popup/common"
import { usePopupContext } from "@popup/context"
import { ElCol, ElRow, ElScrollbar } from "element-plus"
import { defineComponent } from "vue"
import Item from "./Item"
import { doQuery } from "./query"

const Ranking = defineComponent(() => {
    const { query } = usePopupContext()
    const { data: result } = useRequest(() => doQuery(query.value), { deps: query })

    const handleJump = (row: timer.stat.Row) => {
        const siteKey = row?.siteKey
        const date = result.value?.date
        const type = result.value?.query?.type
        jump2Report(siteKey, date, type)
    }

    return () => (
        <ElScrollbar noresize style={{ width: '100%' }}>
            <ElRow gutter={10} style={{ rowGap: '10px' }}>
                {result.value?.rows?.map(row => (
                    <ElCol span={24 / 3}>
                        <Item
                            value={row}
                            type={result.value?.query?.type}
                            max={result.value?.max}
                            total={result.value?.total}
                            onJump={() => handleJump(row)}
                        />
                    </ElCol>
                ))}
            </ElRow>
        </ElScrollbar>
    )
})

export default Ranking

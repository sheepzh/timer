import { useCategories } from "@app/context"
import { t } from "@app/locale"
import { ElTableRowScope } from "@src/element-ui/table"
import { ElTableColumn, ElTag } from "element-plus"
import { defineComponent } from "vue"

const CateColumn = defineComponent(() => {
    const { categories } = useCategories()
    return () => (
        <ElTableColumn
            label={t(msg => msg.siteManage.column.cate)}
        >
            {({ row: { cateId } }: ElTableRowScope<timer.stat.Row>) => {
                const current = categories?.value?.find(c => c.id === cateId)
                return current ? <ElTag size="small" type="primary">{current?.name}</ElTag> : null
            }}
        </ElTableColumn>
    )
})

export default CateColumn
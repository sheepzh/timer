import ColumnHeader from "@app/components/common/ColumnHeader"
import { t } from "@app/locale"
import { type ElTableRowScope } from "@pages/element-ui/table"
import { ElTableColumn, ElTag, type TagProps } from "element-plus"
import { defineComponent } from "vue"
import { ALL_TYPES } from "../../common"

function computeText({ type }: timer.site.SiteInfo): string {
    return t(msg => msg.siteManage.type[type].name)
}

function computeType({ type }: timer.site.SiteInfo): TagProps["type"] {
    switch (type) {
        case 'merged': return 'info'
        case 'virtual': return 'success'
        default: return null
    }
}

const _default = defineComponent(() => {
    return () => (
        <ElTableColumn
            minWidth={130}
            align="center"
            v-slots={{
                header: () => (
                    <ColumnHeader
                        label={t(msg => msg.siteManage.column.type)}
                        v-slots={{
                            tooltipContent: () => ALL_TYPES
                                .map(type => `${t(msg => msg.siteManage.type[type].name)} - ${t(msg => msg.siteManage.type[type].info)}`)
                                .reduce((a, b) => {
                                    a.length && a.push(<br />)
                                    a.push(b)
                                    return a
                                }, []),
                        }}
                    />
                ),
                default: ({ row }: ElTableRowScope<timer.site.SiteInfo>) => (
                    <ElTag size="small" type={computeType(row)}>
                        {computeText(row)}
                    </ElTag>
                )
            }}
        />
    )
})

export default _default
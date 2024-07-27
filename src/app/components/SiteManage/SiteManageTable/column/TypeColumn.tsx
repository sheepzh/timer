import { t } from "@app/locale"
import { ElTableColumn, ElTag, TagProps } from "element-plus"
import { defineComponent } from "vue"
import { SiteManageMessage } from "@i18n/message/app/site-manage"
import { ElTableRowScope } from "@src/element-ui/table"
import ColumnHeader from "@app/components/common/ColumnHeader"

type Type = keyof SiteManageMessage['type']
const ALL_TYPES: Type[] = ['normal', 'merged', 'virtual']

function computeText({ merged, virtual }: timer.site.SiteInfo): string {
    let type: Type = undefined
    if (merged) {
        type = 'merged'
    } else if (virtual) {
        type = 'virtual'
    } else {
        type = 'normal'
    }
    return t(msg => msg.siteManage.type[type].name)
}

function computeType({ merged, virtual }: timer.site.SiteInfo): TagProps["type"] {
    if (merged) {
        return 'info'
    } else if (virtual) {
        return 'success'
    } else {
        return null
    }
}

const _default = defineComponent(() => {
    return () => <ElTableColumn
        minWidth={60}
        align="center"
        v-slots={{
            header: () => <ColumnHeader
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
            />,
            default: ({ row }: ElTableRowScope<timer.site.SiteInfo>) => (
                <ElTag size="small" type={computeType(row)}>
                    {computeText(row)}
                </ElTag>
            )
        }}
    />
})

export default _default
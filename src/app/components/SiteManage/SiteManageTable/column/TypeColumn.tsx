import { t } from "@app/locale"
import { ElIcon, ElTableColumn, ElTag, TagProps, ElTooltip } from "element-plus"
import { InfoFilled } from "@element-plus/icons-vue"
import { defineComponent } from "vue"
import { SiteManageMessage } from "@i18n/message/app/site-manage"
import { ElTableRowScope } from "@src/element-ui/table"

type Type = keyof SiteManageMessage['type']
const ALL_TYPES: Type[] = ['normal', 'merged', 'virtual']

const label = t(msg => msg.siteManage.column.type)

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
        return ''
    }
}

const _default = defineComponent({
    render: () => <ElTableColumn
        minWidth={60}
        align="center"
        v-slots={{
            header: () => <>
                {label}&emsp;
                <ElTooltip placement="top" v-slots={{
                    content: () => ALL_TYPES
                        .map(type => `${t(msg => msg.siteManage.type[type].name)} - ${t(msg => msg.siteManage.type[type].info)}`)
                        .reduce((a, b) => {
                            a.length && a.push(<br />)
                            a.push(b)
                            return a
                        }, []),
                    default: () => <ElIcon size={11}><InfoFilled /></ElIcon>
                }} />
            </>,
            default: ({ row }: ElTableRowScope<timer.site.SiteInfo>) => <ElTag
                size="small"
                type={computeType(row)}
            >
                {computeText(row)}
            </ElTag>
        }}
    />
})

export default _default
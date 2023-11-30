import { t } from "@app/locale"
import { ElIcon, ElTableColumn, ElTag, TagProps, ElTooltip } from "element-plus"
import { InfoFilled } from "@element-plus/icons-vue"
import { defineComponent, h } from "vue"
import { SiteManageMessage } from "@i18n/message/app/site-manage"

type Type = keyof SiteManageMessage['type']
const ALL_TYPES: Type[] = ['normal', 'merged', 'virtual']

const label = t(msg => msg.siteManage.column.type)

function cumputeText({ merged, virtual }: timer.site.SiteInfo): string {
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

const renderTooltip = () => h(ElTooltip, { placement: 'top' }, {
    content: () => ALL_TYPES
        .map((type: Type) => `${t(msg => msg.siteManage.type[type].name)} - ${t(msg => msg.siteManage.type[type].info)}`)
        .reduce((a, b) => {
            a.length && a.push(h('br'))
            a.push(b)
            return a
        }, []),
    default: () => h(ElIcon, { size: 11 }, () => h(InfoFilled)),
})

const renderContent = (row: timer.site.SiteInfo) => h(ElTag, {
    size: 'small',
    type: computeType(row),
}, () => cumputeText(row))

const _default = defineComponent(() => () => h(ElTableColumn, {
    prop: 'host',
    minWidth: 60,
    align: 'center',
}, {
    header: () => [label, ' ', renderTooltip()],
    default: ({ row }: { row: timer.site.SiteInfo }) => renderContent(row)
}))

export default _default
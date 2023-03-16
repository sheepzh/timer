import { t } from "@app/locale"
import { ElTableColumn } from "element-plus"
import { defineComponent, h } from "vue"

const label = t(msg => msg.siteManage.column.icon)

const _default = defineComponent({
    name: "SiteIcon",
    setup() {
        return () => h(ElTableColumn, {
            prop: 'iconUrl',
            label,
            minWidth: 40,
            align: 'center',
        }, {
            default: ({ row }: { row: timer.site.SiteInfo }) => row.iconUrl ? h('img', { width: 12, height: 12, src: row.iconUrl }) : ''
        })
    }
})

export default _default
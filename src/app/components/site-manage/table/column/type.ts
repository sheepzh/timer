import { t } from "@app/locale"
import { ElTableColumn, ElTag } from "element-plus"
import { defineComponent, h } from "vue"

const label = t(msg => msg.siteManage.column.type)

const normalType = t(msg => msg.siteManage.type.normal)
const mergedType = t(msg => msg.siteManage.type.merged)
const virtualType = t(msg => msg.siteManage.type.virtual)

function cumputeText({ merged, virtual }: timer.site.SiteInfo): string {
    if (merged) {
        return mergedType
    } else if (virtual) {
        return virtualType
    } else {
        return normalType
    }
}

function computeType({ merged, virtual }: timer.site.SiteInfo): 'info' | 'success' | '' {
    if (merged) {
        return 'info'
    } else if (virtual) {
        return 'success'
    } else {
        return ''
    }
}

const _default = defineComponent({
    name: "SiteType",
    setup() {
        return () => h(ElTableColumn, {
            prop: 'host',
            label,
            minWidth: 60,
            align: 'center',
        }, {
            default: ({ row }: { row: timer.site.SiteInfo }) => h(ElTag, {
                size: 'small',
                type: computeType(row),
            }, () => cumputeText(row))
        })
    }
})

export default _default
import { ElLink, ElTableColumn, ElTooltip } from "element-plus"
import { Ref, h } from "vue"
import SiteInfo from "../../../../entity/dto/site-info"
import { t } from "../../../locale"

export type HostColumnProps = {
    mergeDomainRef: Ref<boolean>
}

const host2ElLink = (host: string, iconUrl: string) => {
    const link = h(ElLink,
        { href: `http://${host}`, target: '_blank' },
        () => host
    )
    const icon = h('span',
        { style: 'height:23px;line-height:23px;padding-left:2px;' },
        h('img', { src: iconUrl, width: 12, height: 12 })
    )
    return [link, icon]
}

const hostColProp = {
    prop: 'host',
    label: t(msg => msg.item.host),
    minWidth: 210,
    sortable: 'custom',
    align: 'center'
}

const toolTipProp = {
    placement: 'left',
    effect: 'light',
    offset: 10
}
const hostColSlots = (props: HostColumnProps, row: SiteInfo) => {
    // if not merge domain, then only show the link
    if (!props.mergeDomainRef.value) return host2ElLink(row.host, row.iconUrl)
    // Else show the origin hosts in tooltip
    // Fake ElLink
    const elLinkClass = { class: 'el-link el-link--default is-underline' }
    const fakeLink = () => h('span', { class: 'el-link--inner' }, row.host)
    const tooltipInner = () => h('a', elLinkClass, fakeLink())
    // Origin links
    const originLinks = row.mergedHosts.map(origin => h('p', host2ElLink(origin.host, origin.iconUrl)))
    const tooltipContent = () => h('div', { style: 'margin: 10px' }, originLinks)
    const slots = { default: tooltipInner, content: tooltipContent }

    return h<{}>(ElTooltip, toolTipProp, slots)
}
const hostCol = (props: HostColumnProps) => h(ElTableColumn, hostColProp, { default: ({ row }: { row: SiteInfo }) => hostColSlots(props, row) })

export default hostCol
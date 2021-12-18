/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElTableColumn, ElTooltip } from "element-plus"
import { host2ElLink } from "../../../../../app/components/common/table"
import { Ref, h } from "vue"
import DataItem from "../../../../../entity/dto/data-item"
import { t } from "../../../../locale"

export type HostColumnProps = {
    mergeHostRef: Ref<boolean>
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
const hostColSlots = (props: HostColumnProps, row: DataItem) => {
    // if not merge host, then only show the link
    if (!props.mergeHostRef.value) return host2ElLink(row.host, row.iconUrl)
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
const hostCol = (props: HostColumnProps) => h(ElTableColumn, hostColProp, { default: ({ row }: { row: DataItem }) => hostColSlots(props, row) })

export default hostCol
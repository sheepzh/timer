import { computed, defineComponent, PropType } from "vue"
import "./item.sass"
import { ElAvatar, ElCard, ElLink, ElProgress, ElTag, ElText, ElTooltip } from "element-plus"
import { createTab } from "@api/chrome/tab"
import { useShadow } from "@hooks/useShadow"
import { isRemainHost } from "@util/constant/remain-host"
import { formatPeriodCommon } from "@util/time"

export type Row = timer.stat.Row & {
}

const renderTitle = (siteName: string, host: string, handleJump: () => void) => {
    const text = siteName || host
    const tooltip = siteName ? host : null
    const textNode = <ElLink onClick={handleJump}>{text}</ElLink>
    if (!tooltip) return textNode
    return <ElTooltip content={tooltip} placement="top" offset={4}>
        {textNode}
    </ElTooltip >
}

const renderAvatarText = (row: Row) => {
    const { host, alias } = row || {}
    if (alias) return alias.substring(0, 1)?.toUpperCase?.()
    return host?.substring?.(0, 1)?.toUpperCase?.()
}

const _default = defineComponent({
    props: {
        value: Object as PropType<Row>,
        max: Number,
        total: Number,
    },
    setup(props) {
        const [iconUrl] = useShadow(() => props.value?.iconUrl)
        const [host] = useShadow(() => props.value?.host)
        const [siteName] = useShadow(() => props.value?.alias)
        const clickable = computed(() => !isRemainHost(host.value))
        const [rate] = useShadow(() => {
            if (!props.max) return 0
            return (props.value?.focus ?? 0) / props.max * 100
        }, 0)
        const [percentage] = useShadow(() => {
            if (!props.total) return '0 %'
            const val = (props.value?.focus ?? 0) / props.total * 100
            return val.toFixed(2) + ' %'
        })
        const handleJump = () => clickable.value && createTab("https://" + host.value)
        return () => (
            <ElCard class="row-item" shadow="hover">
                <div
                    class={`avatar-container ${clickable.value ? 'clickable' : ''}`}
                    onClick={handleJump}
                >
                    <ElAvatar
                        src={iconUrl.value}
                        shape="square"
                        fit="fill"
                        style={{ backgroundColor: props.value?.iconUrl ? "transparent" : null }}
                    >
                        {renderAvatarText(props.value)}
                    </ElAvatar>
                </div>
                <div class="info-container">
                    <div class="host-title">
                        {renderTitle(siteName.value, host.value, handleJump)}
                        <ElTag size="small">{percentage.value}</ElTag>
                    </div>
                    <div class="host-progress">
                        <div class="time-label">
                            <ElText size="small">
                                {formatPeriodCommon(props.value?.focus ?? 0)}
                            </ElText>
                        </div>
                        <ElProgress percentage={rate.value} showText={false} />
                    </div>
                </div>
            </ElCard >
        )
    }
})

export default _default
import { createTab } from "@api/chrome/tab"
import TooltipWrapper from "@app/components/common/TooltipWrapper"
import { Mouse, Timer } from "@element-plus/icons-vue"
import Flex from "@pages/components/Flex"
import { calJumpUrl } from "@popup/common"
import { useCateNameMap } from "@popup/context"
import { t } from "@popup/locale"
import { isRemainHost } from "@util/constant/remain-host"
import { formatPeriodCommon } from "@util/time"
import { ElAvatar, ElCard, ElIcon, ElLink, ElProgress, ElTag, ElText, ElTooltip } from "element-plus"
import { computed, defineComponent, StyleValue, type PropType } from "vue"

const TITLE_STYLE: StyleValue = {
    whiteSpace: 'nowrap',
    maxWidth: '100%',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    justifyContent: 'flex-start',
    fontSize: 'var(--el-font-size-small)',
}

const Title = defineComponent({
    props: {
        value: Object as PropType<timer.stat.Row>,
        type: String as PropType<timer.core.Dimension>,
        date: [Date, Array] as PropType<Date | [Date, Date?]>,
    },
    setup(props) {
        const cateNameMap = useCateNameMap()
        const siteName = computed(() => {
            const { alias, siteKey: { host } = {} } = props.value || {}
            return alias ?? host
        })
        const url = computed(() => calJumpUrl(props.value?.siteKey, props.date, props.type))

        return () => props.value?.cateKey
            ? (
                <ElTooltip
                    placement="top"
                    offset={4}
                    content={t(msg => msg.content.ranking.cateSiteCount, { siteCount: props.value?.mergedRows.length ?? 0 })}
                >
                    <ElLink style={TITLE_STYLE} onClick={() => { }}>
                        {cateNameMap?.value?.[props.value?.cateKey] ?? 'NaN'}
                    </ElLink>
                </ElTooltip>
            ) : (
                <TooltipWrapper
                    showPopover={!!props.value?.alias}
                    v-slots={{ content: () => props.value?.siteKey?.host ?? '' }}
                >
                    <ElLink
                        onClick={() => url.value && createTab(url.value)}
                        style={TITLE_STYLE}
                        href={url.value ?? '#'}
                    >
                        {siteName.value}
                    </ElLink>
                </TooltipWrapper>
            )
    }
})

const renderAvatarText = (row: timer.stat.Row, cateNameMap: Record<number, string>) => {
    const { siteKey, alias, cateKey } = row || {}
    const cateName = cateNameMap?.[cateKey]
    return [cateName, alias, siteKey?.host]
        .find(a => !!a)
        ?.substring?.(0, 1)
        ?.toUpperCase?.()
        ?? 'NaN'
}

const Item = defineComponent({
    props: {
        value: Object as PropType<timer.stat.Row>,
        max: Number,
        total: Number,
        type: String as PropType<timer.core.Dimension>,
        date: [Date, Array] as PropType<Date | [Date, Date?]>,
    },
    setup(props, ctx) {
        const rate = computed(() => props.max ? (props.value?.[props.type] ?? 0) / props.max * 100 : 0)
        const percentage = computed(() => props.total ? (props.value?.[props.type] ?? 0) / props.total * 100 : 0)

        const cateNameMap = useCateNameMap()

        const clickable = computed(() => {
            const { host, type } = props.value?.siteKey || {}
            return host && type === 'normal' && !isRemainHost(host)
        })
        const iconUrl = computed(() => props.value?.iconUrl)

        const emitJump = () => clickable.value && ctx.emit('jump')

        return () => (
            <ElCard
                bodyClass="ranking-item"
                shadow="hover"
                style={{ padding: 0, height: '80px' }}
                bodyStyle={{ padding: '5px 10px', height: '100%', boxSizing: 'border-box' }}
            >
                <Flex height='100%' gap={10}>
                    <Flex
                        width={40}
                        align="center"
                        justify="space-around"
                        cursor={clickable.value ? 'pointer' : undefined}
                        onClick={emitJump}
                    >
                        <ElAvatar
                            src={iconUrl.value}
                            shape="square"
                            fit="fill"
                            style={{
                                backgroundColor: iconUrl.value ? "transparent" : null,
                                padding: '2px',
                                userSelect: 'none',
                                fontSize: '22px',
                            }}
                        >
                            {renderAvatarText(props.value, cateNameMap.value)}
                        </ElAvatar>
                    </Flex>
                    <Flex direction="column" flex={1}>
                        <Flex align="center" justify="space-between" height={24} gap={4}>
                            <Flex width={0} flex={1} justify="start">
                                <Title value={props.value} type={props.type} date={props.date} />
                            </Flex>
                            <ElTag
                                size="small"
                                style={{ fontSize: '10px', padding: '1px 3px', height: '16px' }}
                            >
                                {percentage.value.toFixed(2)}%
                            </ElTag>
                        </Flex>
                        <Flex direction="column" justify="space-around" flex={1}>
                            <Flex justify="space-between" width="100%" cursor="unset">
                                <ElText type={props.type === 'time' ? 'primary' : 'info'} size="small">
                                    <ElIcon>
                                        <Mouse />
                                    </ElIcon>
                                    {props.value?.time ?? 0}
                                </ElText>
                                <ElText type={props.type === 'focus' ? 'primary' : 'info'} size="small">
                                    <ElIcon>
                                        <Timer />
                                    </ElIcon>
                                    {formatPeriodCommon(props.value?.focus ?? 0)}
                                </ElText>
                            </Flex>
                            <ElProgress percentage={rate.value} showText={false} />
                        </Flex>
                    </Flex>
                </Flex>
            </ElCard >
        )
    },
})

export default Item

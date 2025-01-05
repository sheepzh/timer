import { Mouse, Timer } from "@element-plus/icons-vue"
import { useRequest } from "@hooks/useRequest"
import Flex from "@pages/components/Flex"
import { t } from "@popup/locale"
import cateService from "@service/cate-service"
import { CATE_MERGE_PLACEHOLDER_ID } from "@service/stat-service/common"
import { groupBy } from "@util/array"
import { isRemainHost } from "@util/constant/remain-host"
import { formatPeriodCommon } from "@util/time"
import { ElAvatar, ElCard, ElIcon, ElLink, ElProgress, ElTag, ElText, ElTooltip } from "element-plus"
import { computed, defineComponent, type PropType } from "vue"

const renderTitle = (row: timer.stat.Row, cateNameMap: Record<number, string>, handleJump: () => void) => {
    const { siteKey, cateKey, alias, mergedRows } = row || {}
    if (cateKey) {
        return (
            <ElTooltip
                placement="top"
                offset={4}
                content={t(msg => msg.content.ranking.cateSiteCount, { siteCount: mergedRows.length ?? 0 })}
            >
                <ElLink href="#" onClick={handleJump}>
                    {cateNameMap?.[cateKey] ?? 'NaN'}
                </ElLink>
            </ElTooltip>
        )
    }

    const { host } = siteKey || {}

    const text = alias || host || 'NaN'
    const tooltip = alias ? host : null
    const textNode = <ElLink onClick={handleJump}>{text}</ElLink>

    if (!tooltip) return textNode
    return (
        <ElTooltip content={tooltip} placement="top" offset={4}>
            {textNode}
        </ElTooltip >
    )
}

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
    },
    emits: {
        jump: () => true
    },
    setup(props, ctx) {
        const rate = computed(() => props.max ? (props.value?.[props.type] ?? 0) / props.max * 100 : 0)
        const percentage = computed(() => props.total ? (props.value?.[props.type] ?? 0) / props.total * 100 : 0)

        const { data: cateNameMap } = useRequest(async () => {
            const categories = await cateService.listAll()
            const nameMap = groupBy(categories, c => c.id, l => l?.[0]?.name)
            nameMap[CATE_MERGE_PLACEHOLDER_ID] = t(msg => msg.shared.cate.notSet)
            return nameMap
        })

        const clickable = computed(() => {
            const { host, type } = props.value?.siteKey || {}
            return host && type === 'normal' && !isRemainHost(host)
        })
        const iconUrl = computed(() => props.value?.iconUrl)

        const emitJump = () => clickable.value && ctx.emit('jump')

        return () => (
            <ElCard
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
                        <Flex align="center" justify="space-between" height={24} gap={3}>
                            {renderTitle(props.value, cateNameMap.value, emitJump)}
                            <ElTag
                                size="small"
                                style={{ fontSize: '10px', padding: '1px 3px', height: '16px' }}
                            >
                                {percentage.value.toFixed(2)}%
                            </ElTag>
                        </Flex>
                        <Flex direction="column" justify="space-around" flex={1}>
                            <Flex justify="space-between" width="100%" cursor="unset">
                                <ElText type={props.type === 'time' ? 'primary' : 'info'}>
                                    <ElIcon>
                                        <Mouse />
                                    </ElIcon>
                                    {props.value?.time ?? 0}
                                </ElText>
                                <ElText type={props.type === 'focus' ? 'primary' : 'info'}>
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

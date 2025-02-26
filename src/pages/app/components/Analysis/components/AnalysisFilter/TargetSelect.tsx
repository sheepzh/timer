import { SELECT_WRAPPER_STYLE } from "@app/components/common/filter/common"
import { useCategories } from "@app/context"
import { t } from "@app/locale"
import { useRequest, useState } from "@hooks"
import Flex from "@pages/components/Flex"
import siteService from "@service/site-service"
import statService from "@service/stat-service"
import { identifySiteKey, parseSiteKeyFromIdentity, SiteMap } from "@util/site"
import { useDebounce } from "@vueuse/core"
import { ElOption, ElOptionGroup, ElSelect, ElTag } from "element-plus"
import { computed, defineComponent, type PropType } from "vue"
import type { AnalysisTarget } from "../../types"
import { labelOfHostInfo } from "../../util"

const SITE_PREFIX = 'S'
const CATE_PREFIX = 'C'

const cvtTarget2Key = (target: AnalysisTarget): string => {
    if (target?.type === 'site') {
        return `${SITE_PREFIX}${identifySiteKey(target.key)}`
    } else if (target?.type === 'cate') {
        return `${CATE_PREFIX}${target.key}`
    }
    return ''
}

const cvtKey2Target = (key: string): AnalysisTarget => {
    if (!key) return undefined
    const prefix = key?.charAt?.(0)
    const content = key?.substring(1)
    if (prefix === SITE_PREFIX) {
        return { type: 'site', key: parseSiteKeyFromIdentity(content) }
    } else if (prefix === CATE_PREFIX) {
        let cateId = undefined
        try {
            cateId = parseInt(content)
        } catch { }
        return { type: 'cate', key: cateId }
    }
    return undefined
}

type TargetItem = AnalysisTarget & {
    label: string
}

function collectHosts(hosts: Record<timer.site.Type, string[]>, collector: SiteMap<timer.site.SiteInfo>) {
    Object.entries(hosts).forEach(([key, arr]) => {
        const type = key as timer.site.Type
        arr.forEach(host => {
            const site: timer.site.SiteInfo = { host, type }
            collector?.put(site, site)
        })
    })
}

const fetchItems = async (categories: timer.site.Cate[]): Promise<[siteItems: TargetItem[], cateItems: TargetItem[]]> => {
    // 1. query categories
    const cateItems = categories?.map(({ id, name }) => ({ type: 'cate', key: id, label: name } satisfies TargetItem))

    // 2. query sites
    const siteSet = new SiteMap<timer.site.SiteInfo>()

    // 2.1 sites from hosts
    const hosts = await statService.listHosts()
    collectHosts(hosts, siteSet)

    // 2.2 query sites from sites
    const sites = await siteService.selectAll()
    sites?.forEach(site => siteSet.put(site, site))

    const siteItems = siteSet?.map((_, site) => ({ type: 'site', key: site, label: labelOfHostInfo(site) }) satisfies TargetItem)

    return [cateItems, siteItems]
}

const SiteTypeTag = defineComponent({
    props: {
        text: String,
    },
    setup: ({ text }) => {
        return () => (
            <span style={{ float: "right", height: "34px" }}>
                <ElTag size="small">{text}</ElTag>
            </span>
        )
    }
})

const SiteOption = defineComponent({
    props: {
        value: Object as PropType<timer.site.SiteInfo>
    },
    setup(props) {
        const alias = computed(() => props.value?.alias)
        const type = computed(() => props.value?.type)
        const mergedText = t(msg => msg.analysis.common.merged)
        const virtualText = t(msg => msg.analysis.common.virtual)

        return () => (
            <Flex align="center" gap={4}>
                <span>{props.value?.host}</span>
                <ElTag v-show={!!alias.value} size="small" type="info">
                    {alias.value}
                </ElTag>
                {type.value === 'merged' && < SiteTypeTag text={mergedText} />}
                {type.value === 'virtual' && <SiteTypeTag text={virtualText} />}
            </Flex>
        )
    },
})

const TargetSelect = defineComponent({
    props: {
        modelValue: Object as PropType<AnalysisTarget>,
    },
    emits: {
        change: (_val?: AnalysisTarget) => true,
    },
    setup(props, ctx) {
        const { categories } = useCategories()
        const selectKey = computed(() => cvtTarget2Key(props.modelValue))

        const emitChange = (selectKey?: string) => {
            const target = cvtKey2Target(selectKey)
            ctx.emit('change', target)
        }

        const { data: allItems } = useRequest(
            () => fetchItems(categories.value),
            { deps: categories },
        )

        const [query, setQuery] = useState<string>()
        const debouncedQuery = useDebounce<string>(query, 50)

        const items = computed(() => {
            const q = debouncedQuery.value?.trim?.()
            if (!q) return allItems.value

            return allItems.value?.map(itemArr => {
                const newItems = itemArr.filter(item => {
                    if (item.type === 'cate') {
                        return item.label?.includes?.(q)
                    } else {
                        const { host, alias } = item.key || {}
                        return host?.includes?.(q) || alias?.includes?.(q)
                    }
                })
                return newItems
            }) ?? []
        })

        return () => (
            <ElSelect
                placeholder={t(msg => msg.analysis.common.hostPlaceholder)}
                modelValue={selectKey.value}
                filterable
                remote
                clearable
                remoteMethod={setQuery}
                onChange={emitChange}
                onClear={() => emitChange()}
                style={SELECT_WRAPPER_STYLE}
            >
                {!!items.value?.[0]?.length && (
                    <ElOptionGroup label={t(msg => msg.analysis.target.cate)}>
                        {items.value?.[0]?.map(cateItem => (
                            <ElOption value={cvtTarget2Key(cateItem)} label={cateItem.label} />
                        ))}
                    </ElOptionGroup>
                )}
                {!!items.value?.[1]?.length && (
                    <ElOptionGroup label={t(msg => msg.analysis.target.site)}>
                        {items.value?.[1]?.map(siteItem => (
                            <ElOption
                                value={cvtTarget2Key(siteItem)}
                                label={siteItem.label}
                            >
                                <SiteOption value={siteItem.key as timer.site.SiteInfo} />
                            </ElOption>
                        ))}
                    </ElOptionGroup>
                )}
            </ElSelect>
        )
    },
})

export default TargetSelect
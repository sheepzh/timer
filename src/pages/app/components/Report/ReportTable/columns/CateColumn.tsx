import { useCategories } from "@app/context"
import { t } from "@app/locale"
import Flex from "@pages/components/Flex"
import { type ElTableRowScope } from "@pages/element-ui/table"
import { CATE_MERGE_PLACEHOLDER_ID } from "@service/stat-service/common"
import { SiteMap } from "@util/site"
import { Effect, ElTableColumn, ElTag, ElText, ElTooltip } from "element-plus"
import { defineComponent } from "vue"
import TooltipSiteList from "./TooltipSiteList"

const renderSimple = (cateId: number, categories: timer.site.Cate[]) => {
    const current = categories?.find(c => c.id === cateId)
    if (!current) return null
    return (
        <ElTag size="small" type="primary">
            {current?.name}
        </ElTag>
    )
}

const renderMerged = (cateId: number, categories: timer.site.Cate[], merged: timer.stat.Row[]) => {
    let cateName = undefined
    let isNotSet = false
    const siteMap = new SiteMap<string>()
    merged?.forEach(({ siteKey, iconUrl }) => siteMap.put(siteKey, iconUrl))

    if (cateId === CATE_MERGE_PLACEHOLDER_ID) {
        cateName = t(msg => msg.shared.cate.notSet)
        isNotSet = true
    } else {
        const current = categories?.find(c => c.id === cateId)
        if (!current) return null
        cateName = current?.name
    }
    return (
        <ElTooltip
            effect={Effect.LIGHT}
            offset={10}
            placement="left"
            popperStyle={{ paddingRight: 0 }}
            v-slots={{
                content: () => <TooltipSiteList modelValue={merged} />,
                default: () => (
                    <ElText size="small" type={isNotSet ? 'info' : 'primary'}>
                        {cateName}
                    </ElText>
                ),
            }}
        />
    )
}

const CateColumn = defineComponent(() => {
    const { categories } = useCategories()

    return () => (
        <ElTableColumn
            label={t(msg => msg.siteManage.column.cate)}
        >
            {({ row: { cateId, cateKey, mergedRows } }: ElTableRowScope<timer.stat.Row>) => {
                const allCates = categories.value
                return (
                    <Flex justify="center">
                        {cateKey ? renderMerged(cateKey, allCates, mergedRows) : renderSimple(cateId, allCates)}
                    </Flex>
                )
            }}
        </ElTableColumn>
    )
})

export default CateColumn
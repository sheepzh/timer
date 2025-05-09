import CategoryEditable from "@app/components/common/category/CategoryEditable"
import { useCategories } from "@app/context"
import { t } from "@app/locale"
import Flex from "@pages/components/Flex"
import { type ElTableRowScope } from "@pages/element-ui/table"
import { CATE_NOT_SET_ID, SiteMap } from "@util/site"
import { identifyStatKey } from "@util/stat"
import { Effect, ElTableColumn, ElText, ElTooltip } from "element-plus"
import { defineComponent } from "vue"
import TooltipSiteList from "./TooltipSiteList"

const renderMerged = (cateId: number, categories: timer.site.Cate[], merged: timer.stat.Row[]) => {
    let cateName: string
    let isNotSet = false
    const siteMap = new SiteMap<string>()
    merged?.forEach(({ siteKey, iconUrl }) => siteKey && siteMap.put(siteKey, iconUrl))

    if (cateId === CATE_NOT_SET_ID) {
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
            popperStyle={{ paddingInlineEnd: 0 }}
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

type Props = {
    onChange: (key: timer.site.SiteKey, newCate: number | undefined) => void,
}

const CateColumn = defineComponent<Props>(props => {
    const { categories } = useCategories()
    return () => (
        <ElTableColumn label={t(msg => msg.siteManage.column.cate)} minWidth={140}>
            {({ row }: ElTableRowScope<timer.stat.Row>) => {
                const { cateId, cateKey, mergedRows, siteKey } = row || {}
                return (
                    <Flex key={`${identifyStatKey(row)}_${cateId}`} justify="center">
                        {cateKey
                            ? renderMerged(cateKey, categories.value, mergedRows ?? [])
                            : <CategoryEditable
                                siteKey={siteKey!}
                                cateId={cateId}
                                onChange={newCateId => props.onChange(siteKey!, newCateId)}
                            />
                        }
                    </Flex>
                )
            }}
        </ElTableColumn>
    )
}, { props: ['onChange'] })

export default CateColumn
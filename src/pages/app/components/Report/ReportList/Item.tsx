import HostAlert from "@app/components/common/HostAlert"
import PopupConfirmButton from "@app/components/common/PopupConfirmButton"
import TooltipWrapper from "@app/components/common/TooltipWrapper"
import { cvt2LocaleTime, periodFormatter } from "@app/util/time"
import { Calendar, Delete, Mouse, QuartzWatch } from "@element-plus/icons-vue"
import { useTabGroups } from "@hooks/useTabGroups"
import { getComposition, isGroup, isNormalSite, isSite } from "@util/stat"
import { Effect, ElCheckbox, ElDivider, ElIcon, ElTag } from "element-plus"
import { computed, defineComponent, ref, watch } from "vue"
import { computeDeleteConfirmMsg, handleDelete } from "../common"
import CompositionTable from "../CompositionTable"
import { useReportFilter } from "../context"
import TooltipSiteList from "../ReportTable/columns/TooltipSiteList"

type Props = {
    value: timer.stat.Row
    onSelectedChange: ArgCallback<boolean>
    onDelete?: ArgCallback<timer.stat.Row>
}

const _default = defineComponent<Props>(props => {
    const filter = useReportFilter()
    const { groupMap } = useTabGroups()
    const formatter = (focus: number): string => periodFormatter(focus, { format: filter?.timeFormat })
    const { date, focus, time } = props.value
    const mergedRows = isGroup(props.value) ? [] : props.value?.mergedRows ?? []
    const selected = ref(false)
    watch(selected, val => props.onSelectedChange?.(val))

    const canDelete = computed(() => isNormalSite(props.value) && !filter.readRemote)
    const onDelete = async () => {
        await handleDelete(props.value, filter)
        props.onDelete?.(props.value)
    }
    return () => (
        <div class="report-item">
            <div class="report-item-head">
                <div class="report-item-title">
                    <ElCheckbox
                        v-show={canDelete.value}
                        size="small"
                        value={selected.value}
                        onChange={val => selected.value = !!val}
                    />
                    {isSite(props.value) && (
                        <TooltipWrapper
                            placement="bottom"
                            effect={Effect.LIGHT}
                            offset={10}
                            trigger="click"
                            usePopover={props.value.siteKey.type === 'merged'}
                            v-slots={{
                                content: () => <TooltipSiteList modelValue={mergedRows} />,
                            }}
                        >
                            <HostAlert
                                value={props.value.siteKey}
                                iconUrl={props.value.iconUrl}
                                clickable={false}
                            />
                        </TooltipWrapper>
                    )}
                </div>
                {canDelete.value && (
                    <PopupConfirmButton
                        buttonIcon={Delete}
                        buttonType="danger"
                        confirmText={computeDeleteConfirmMsg(props.value, filter, groupMap.value)}

                        onConfirm={onDelete}
                        text
                    />
                )}
            </div>
            <ElDivider style={{ margin: "5px 0" }} />
            <div class="report-item-content">
                <ElTag v-show={!filter?.mergeDate} type="info" size="small">
                    <ElIcon><Calendar /></ElIcon>
                    <span>{cvt2LocaleTime(date)}</span>
                </ElTag>
                <TooltipWrapper
                    placement="top"
                    effect={Effect.LIGHT}
                    offset={10}
                    trigger="click"
                    v-slots={{
                        content: () => <CompositionTable valueFormatter={formatter} data={getComposition(props.value, 'focus')} />,
                    }}
                >
                    <ElTag type="primary" size="small">
                        <ElIcon><QuartzWatch /></ElIcon>
                        <span>{periodFormatter(focus, { format: filter?.timeFormat })}</span>
                    </ElTag>
                </TooltipWrapper>
                <TooltipWrapper
                    placement="top"
                    effect={Effect.LIGHT}
                    offset={10}
                    trigger="click"
                    v-slots={{
                        content: () => <CompositionTable data={getComposition(props.value, 'time')} />,
                    }}
                >
                    <ElTag type="warning" size="small">
                        <ElIcon><Mouse /></ElIcon>
                        <span>{time ?? 0}</span>
                    </ElTag>
                </TooltipWrapper>
            </div>
        </div>
    )
}, { props: ['onDelete', 'onSelectedChange', 'value'] })

export default _default
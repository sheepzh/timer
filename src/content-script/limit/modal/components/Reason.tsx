import { defineComponent } from "vue"
import { useReason, useRule } from "../context"
import { t } from "@cs/locale"
import { ElDescriptions, ElDescriptionsItem } from "element-plus"
import { useRequest } from "@hooks"
import { formatPeriodCommon, MILL_PER_SECOND } from "@util/time"
import { period2Str } from "@util/limit"

const _default = defineComponent(() => {
    const reason = useReason()
    const rule = useRule()

    const { data: browsingTime, refresh: refreshBrowsingTime } = useRequest(() => {
        const { getVisitTime, type } = reason.value || {}
        if (type !== 'VISIT') return
        return getVisitTime?.() || 0
    })

    setInterval(refreshBrowsingTime, 1000)

    return () => (
        <div class="reason-container">
            <ElDescriptions border column={1}>
                <ElDescriptionsItem label={t(msg => msg.limit.item.name)} labelAlign="right">
                    {rule.value?.name || '-'}
                </ElDescriptionsItem>
                {
                    reason.value?.type === 'DAILY' && <>
                        <ElDescriptionsItem label={t(msg => msg.limit.item.time)} labelAlign="right">
                            {formatPeriodCommon(rule.value?.time * MILL_PER_SECOND) || '-'}
                        </ElDescriptionsItem>
                        {(!!reason.value?.allowDelay || !!reason.value?.delayCount) && (
                            <ElDescriptionsItem label={t(msg => msg.limit.item.delayCount)} labelAlign="right">
                                {rule.value?.delayCount ?? 0}
                            </ElDescriptionsItem>
                        )}
                        <ElDescriptionsItem label={t(msg => msg.limit.item.waste)} labelAlign="right">
                            {formatPeriodCommon(rule.value?.waste) || '-'}
                        </ElDescriptionsItem>
                    </>
                }
                {
                    reason.value?.type === 'WEEKLY' && <>
                        <ElDescriptionsItem label={t(msg => msg.limit.item.weekly)} labelAlign="right">
                            {formatPeriodCommon(rule.value?.weekly * MILL_PER_SECOND) || '-'}
                        </ElDescriptionsItem>
                        {(!!reason.value?.allowDelay || !!reason.value?.delayCount) && (
                            <ElDescriptionsItem label={t(msg => msg.limit.item.delayCount)} labelAlign="right">
                                {rule.value?.weeklyDelayCount ?? 0}
                            </ElDescriptionsItem>
                        )}
                        <ElDescriptionsItem label={t(msg => msg.limit.item.wasteWeekly)} labelAlign="right">
                            {formatPeriodCommon(rule.value?.weeklyWaste) || '-'}
                        </ElDescriptionsItem>
                    </>
                }
                {
                    reason.value?.type === 'VISIT' && <>
                        <ElDescriptionsItem label={t(msg => msg.limit.item.visitTime)} labelAlign="right">
                            {formatPeriodCommon(rule.value?.visitTime * MILL_PER_SECOND) || '-'}
                        </ElDescriptionsItem>
                        {(!!reason.value?.allowDelay || !!reason.value?.delayCount) && (
                            <ElDescriptionsItem label={t(msg => msg.limit.item.delayCount)} labelAlign="right">
                                {reason.value?.delayCount ?? 0}
                            </ElDescriptionsItem>
                        )}
                        <ElDescriptionsItem label={t(msg => msg.modal.browsingTime)} labelAlign="right">
                            {browsingTime.value ? formatPeriodCommon(browsingTime.value) : '-'}
                        </ElDescriptionsItem>
                    </>
                }
                {
                    reason.value?.type === 'PERIOD' &&
                    <ElDescriptionsItem label={t(msg => msg.limit.item.period)} labelAlign="right">
                        {
                            rule.value?.periods?.length
                                ? <div>
                                    {rule.value?.periods.map(p => <span style={{ display: "block" }}>{period2Str(p)}</span>)}
                                </div>
                                : '-'
                        }
                    </ElDescriptionsItem>
                }
            </ElDescriptions>
        </div>
    )
})

export default _default
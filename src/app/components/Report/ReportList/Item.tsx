import { Effect, ElCheckbox, ElDivider, ElIcon, ElTag } from "element-plus"
import { computed, defineComponent, PropType, ref, watch } from "vue"
import { useReportFilter } from "../context"
import HostAlert from "@app/components/common/HostAlert"
import { cvt2LocaleTime, periodFormatter } from "@app/util/time"
import CompositionTable from "../CompositionTable"
import { Calendar, Delete, Mouse, QuartzWatch } from "@element-plus/icons-vue"
import TooltipWrapper from "@app/components/common/TooltipWrapper"
import PopupConfirmButton from "@app/components/common/PopupConfirmButton"
import { computeDeleteConfirmMsg, handleDelete } from "../common"

const _default = defineComponent({
    props: {
        value: Object as PropType<timer.stat.Row>,
    },
    emits: {
        selectedChange: (_val: boolean) => true,
        delete: (_val: timer.stat.Row) => true,
    },
    setup(props, ctx) {
        const filter = useReportFilter()
        const mergeHost = computed(() => !!filter.value?.mergeHost)
        const formatter = (focus: number): string => periodFormatter(focus, { format: filter.value?.timeFormat })
        const { iconUrl, host, mergedHosts, date, focus, composition, time } = props.value || {}
        const selected = ref(false)
        watch(selected, val => ctx.emit('selectedChange', val))

        const canDelete = computed(() => !filter.value?.mergeHost && !filter.value.readRemote)
        const onDelete = async () => {
            await handleDelete(props.value, filter.value)
            ctx.emit('delete', props.value)
        }
        return () => <>
            <div class="report-item">
                <div class="report-item-head">
                    <div class="report-item-title">
                        <ElCheckbox
                            v-show={canDelete.value}
                            size="small"
                            value={selected.value}
                            onChange={val => selected.value = !!val}
                        />
                        <TooltipWrapper
                            placement="bottom"
                            effect={Effect.LIGHT}
                            offset={10}
                            trigger="click"
                            showPopover={mergeHost.value}
                            v-slots={{
                                content: () => mergedHosts?.map(({ host, iconUrl }) => (
                                    <p>
                                        <HostAlert host={host} iconUrl={iconUrl} clickable={false} />
                                    </p>
                                )),
                            }}
                        >
                            <HostAlert
                                host={host}
                                iconUrl={mergeHost.value ? null : iconUrl}
                                clickable={false}
                            />
                        </TooltipWrapper>
                    </div>
                    <PopupConfirmButton
                        buttonIcon={Delete}
                        buttonType="danger"
                        confirmText={computeDeleteConfirmMsg(props.value, filter.value)}
                        visible={canDelete.value}
                        onConfirm={onDelete}
                        text
                    />
                </div>
                <ElDivider style={{ margin: "5px 0" }} />
                <div class="report-item-content">
                    <ElTag v-show={!filter.value?.mergeDate} type="info" size="small">
                        <ElIcon><Calendar /></ElIcon>
                        <span>{cvt2LocaleTime(date)}</span>
                    </ElTag>
                    <TooltipWrapper
                        placement="top"
                        effect={Effect.LIGHT}
                        offset={10}
                        trigger="click"
                        v-slots={{
                            content: () => <CompositionTable valueFormatter={formatter} data={composition?.focus || []} />,
                        }}
                    >
                        <ElTag type="primary" size="small">
                            <ElIcon><QuartzWatch /></ElIcon>
                            <span>{periodFormatter(focus, { format: filter.value?.timeFormat })}</span>
                        </ElTag>
                    </TooltipWrapper>
                    <TooltipWrapper
                        placement="top"
                        effect={Effect.LIGHT}
                        offset={10}
                        trigger="click"
                        v-slots={{
                            content: () => <CompositionTable data={composition?.time || []} />,
                        }}
                    >
                        <ElTag type="warning" size="small">
                            <ElIcon><Mouse /></ElIcon>
                            <span>{time ?? 0}</span>
                        </ElTag>
                    </TooltipWrapper>
                </div>
            </div>
        </>
    },
})

export default _default
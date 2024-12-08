import { createTab } from "@api/chrome/tab"
import { View } from "@element-plus/icons-vue"
import { useRequest } from "@hooks/useRequest"
import { useState } from "@hooks/useState"
import { PopupQuery } from "@popup/common"
import DurationSelect from "@popup/components/DurationSelect"
import { t } from "@popup/locale"
import optionService from "@service/option-service"
import packageInfo from "@src/package"
import { getAppPageUrl } from "@util/constant/url"
import { ALL_DIMENSIONS } from "@util/stat"
import { ElLink, ElOption, ElPopover, ElSelect, ElSwitch, ElText } from "element-plus"
import { defineComponent, watch } from "vue"
import Extra from "./Extra"

const Bar = defineComponent({
    props: {
        total: String,
    },
    emits: {
        queryChange: (_query: PopupQuery) => true,
    },
    setup(props, ctx) {
        const [query, setQuery] = useState<PopupQuery>()
        watch(query, () => ctx.emit('queryChange', query.value))

        useRequest(() => optionService.getAllOption(), {
            onSuccess: option => setQuery({
                mergeHost: option?.defaultMergeDomain,
                type: option?.defaultType,
                duration: option?.defaultDuration,
                durationNum: option?.defaultDurationNum,
            })
        })

        const updateQuery = <K extends keyof PopupQuery>(k: K, v: PopupQuery[K]) => {
            const newQuery = {
                ...query.value || ({
                    mergeHost: undefined,
                    duration: undefined,
                    type: undefined,
                } satisfies PopupQuery),
                [k]: v,
            } satisfies PopupQuery
            setQuery(newQuery)
        }

        const handleAllFuncClick = () => createTab(getAppPageUrl(false, '/'))

        return () => (
            <div class="option-container">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <ElText type="info" size="small">
                        {[`v${packageInfo.version}`, props.total].filter(v => !!v).join(' | ')}
                    </ElText>
                </div>
                <div class="right">
                    <Extra />
                    <ElLink onClick={handleAllFuncClick} icon={<View />}>
                        {t(msg => msg.base.allFunction)}
                    </ElLink>
                    <ElPopover
                        effect="dark"
                        content={t(msg => msg.chart.mergeHostLabel)}
                        width="auto"
                        v-slots={{
                            reference: () => (
                                <ElSwitch
                                    modelValue={query.value?.mergeHost}
                                    onChange={(v: boolean) => updateQuery('mergeHost', !!v)}
                                />
                            )
                        }}
                    />
                    <DurationSelect
                        reverse
                        modelValue={[query.value?.duration, query.value?.durationNum]}
                        onChange={([duration, durationNum]) => setQuery({
                            ...query.value || ({
                                mergeHost: undefined,
                                duration: undefined,
                                type: undefined,
                            } satisfies PopupQuery),
                            duration, durationNum,
                        })}
                    />
                    <ElSelect
                        modelValue={query?.value?.type}
                        onChange={(v: timer.stat.Dimension) => updateQuery('type', v)}
                        popperOptions={{ placement: 'top' }}
                    >
                        {ALL_DIMENSIONS.map(item => <ElOption value={item} label={t(msg => msg.item[item])} />)}
                    </ElSelect>
                </div>
            </div>
        )
    }
})

export default Bar
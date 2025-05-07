/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { Check, Close } from "@element-plus/icons-vue"
import { useRequest, useShadow } from "@hooks"
import Box from "@pages/components/Box"
import siteService from "@service/site-service"
import { isRemainHost } from "@util/constant/remain-host"
import { isValidHost, judgeVirtualFast } from "@util/pattern"
import { ElButton, ElMessage, ElOption, ElSelect, ElTag } from "element-plus"
import { defineComponent, StyleValue } from "vue"

async function remoteSearch(query: string): Promise<timer.site.SiteInfo[]> {
    if (!query) return []

    let sites: timer.site.SiteInfo[] = await siteService.selectAll({ fuzzyQuery: query })
    // Add local files
    const idx = sites.findIndex(s => s.host === query)
    const target = idx > 0
        // Move to the first index
        ? sites.splice(idx, 1)?.[0]
        : { host: query, type: judgeVirtualFast(query) ? 'virtual' : 'normal' } satisfies timer.site.SiteKey
    return [target, ...sites]
}

type Props = {
    defaultValue?: string
    onSave?: (white: string) => void
    onCancel?: () => void
    end?: boolean
}

const _default = defineComponent<Props>(props => {
    const [white, setWhite, resetWhite] = useShadow(() => props.defaultValue)
    const { data: sites, refresh: search, loading: searching } = useRequest(remoteSearch)

    const handleSubmit = () => {
        const val = white.value
        if (!val) return
        if (isRemainHost(val) || isValidHost(val) || judgeVirtualFast(val)) {
            props.onSave?.(val)
        } else {
            ElMessage.warning(t(msg => msg.whitelist.errorInput))
        }
    }
    const handleCancel = () => {
        resetWhite()
        props.onCancel?.()
    }

    return () => (
        <Box style={{ marginInlineEnd: props.end ? 'auto' : undefined }}>
            <ElSelect
                style={{ width: '160px' }}
                modelValue={white.value}
                onChange={setWhite}
                placeholder={t(msg => msg.item.host)}
                clearable
                onClear={() => setWhite(undefined)}
                filterable
                remote
                loading={searching.value}
                remoteMethod={search}
            >
                {sites.value?.map(({ host, type }) => <ElOption value={host} label={host}>
                    <span>{host}</span>
                    <ElTag v-show={type === 'virtual'} size="small">
                        {t(msg => msg.siteManage.type.virtual?.name)?.toLocaleUpperCase?.()}
                    </ElTag>
                </ElOption>)}
            </ElSelect>
            <ElButton icon={Close} onClick={handleCancel} />
            <ElButton icon={Check} onClick={handleSubmit} style={{ marginLeft: 0 } satisfies StyleValue} />
        </Box>
    )
}, { props: ['defaultValue', 'onCancel', 'onSave', 'end'] })

export default _default
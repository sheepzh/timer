/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { Check, Close } from "@element-plus/icons-vue"
import { useRequest, useShadow } from "@hooks"
import siteService from "@service/site-service"
import { isRemainHost } from "@util/constant/remain-host"
import { isValidHost, judgeVirtualFast } from "@util/pattern"
import { ElButton, ElMessage, ElOption, ElSelect, ElTag } from "element-plus"
import { defineComponent } from "vue"
import './style.sass'

async function handleRemoteSearch(query: string): Promise<timer.site.SiteInfo[]> {
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

const _default = defineComponent({
    props: {
        defaultValue: String,
    },
    emits: {
        save: (_white: string) => true,
        cancel: () => true,
    },
    setup(props, ctx) {
        const [white, setWhite, resetWhite] = useShadow(() => props.defaultValue)
        const { data: sites, refresh: search, loading: searching } = useRequest(handleRemoteSearch)

        const handleSubmit = () => {
            const val = white.value
            if (!val) return
            if (isRemainHost(val) || isValidHost(val) || judgeVirtualFast(val)) {
                ctx.emit("save", val)
            } else {
                ElMessage.warning(t(msg => msg.whitelist.errorInput))
            }
        }

        return () => <div class="item-input-container">
            <ElSelect
                class="input-new-tag editable-item whitelist-item-input"
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
            <ElButton
                size="small"
                icon={<Close />}
                class="item-cancel-button editable-item"
                onClick={() => {
                    resetWhite()
                    ctx.emit("cancel")
                }}
            />
            <ElButton
                size="small"
                icon={<Check />}
                class="item-check-button editable-item"
                onClick={handleSubmit}
            />
        </div>
    }
})

export default _default
/**
 * Copyright (c) 2022-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { UploadFilled } from "@element-plus/icons-vue"
import { useRequest } from "@hooks"
import statService from "@service/stat-service"
import { ElButton, ElIcon, ElTooltip } from "element-plus"
import { defineComponent, ref, watch, computed } from "vue"

const _default = defineComponent({
    emits: {
        change: (_readRemote: boolean) => true
    },
    setup(_, ctx) {
        const readRemote = ref(false)
        watch(readRemote, () => ctx.emit("change", readRemote.value))
        const content = computed(() => t(msg => msg.report.remoteReading[readRemote.value ? 'on' : 'off']))
        const { data: visible } = useRequest(() => statService.canReadRemote(), { defaultValue: false })

        return () => (
            <ElTooltip trigger="hover" placement="bottom-start" effect="dark" content={content.value}>
                <ElButton
                    size="small"
                    style={{ display: visible.value ? 'inline-flex' : 'none' }}
                    type={readRemote.value ? 'primary' : null}
                    class="record-filter-icon-button"
                    onClick={() => readRemote.value = !readRemote.value}
                >
                    <ElIcon size={17} style={{ padding: "0 1px" }}>
                        <UploadFilled />
                    </ElIcon>
                </ElButton>
            </ElTooltip>
        )
    }
})

export default _default
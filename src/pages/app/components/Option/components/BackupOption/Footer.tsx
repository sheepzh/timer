/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { Operation, UploadFilled } from "@element-plus/icons-vue"
import { useRequest, useState } from "@hooks"
import processor from "@service/backup/processor"
import metaService from "@service/meta-service"
import { formatTime } from "@util/time"
import { ElButton, ElDivider, ElLoading, ElMessage, ElText } from "element-plus"
import { defineComponent, toRef } from "vue"
import Clear from "./Clear"
import Download from "./Download"

async function handleTest() {
    const loading = ElLoading.service({ text: "Please wait...." })
    try {
        const { errorMsg } = await processor.checkAuth()
        if (!errorMsg) {
            ElMessage.success("Valid!")
        } else {
            ElMessage.error(errorMsg)
        }
    } finally {
        loading.close()
    }
}

const TIME_FORMAT = t(msg => msg.calendar.timeFormat)

const _default = defineComponent<{ type: timer.backup.Type }>(props => {
    const type = toRef(props, 'type')

    const [lastTime, setLastTime] = useState<number>()

    useRequest(async () => {
        const typeVal = type.value
        return typeVal && (await metaService.getLastBackUp(typeVal))?.ts
    }, { deps: type, onSuccess: setLastTime })

    async function handleBackup() {
        const loading = ElLoading.service({
            text: "Doing backup...."
        })
        const result = await processor.syncData()
        loading.close()
        if (result.success) {
            ElMessage.success('Successfully!')
            setLastTime(result.data ?? Date.now())
        } else {
            ElMessage.error(result.errorMsg || 'Unknown error')
        }
    }

    return () => <div>
        <ElDivider />
        <div class="backup-footer">
            <ElButton type="primary" icon={<Operation />} onClick={handleTest}>
                {t(msg => msg.button.test)}
            </ElButton>
            <Clear />
            <Download />
            <ElButton type="primary" icon={<UploadFilled />} onClick={handleBackup}>
                {t(msg => msg.option.backup.operation)}
            </ElButton>
            <ElText v-show={!!lastTime.value} style={{ marginLeft: "8px" }}>
                {t(
                    msg => msg.option.backup.lastTimeTip,
                    { lastTime: (lastTime.value && formatTime(lastTime.value, TIME_FORMAT)) ?? '' }
                )}
            </ElText>
        </div>
    </div>
})

export default _default
/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { PropType, Ref } from "vue"

import { t } from "@app/locale"
import { UploadFilled, RefreshRight } from "@element-plus/icons-vue"
import { ElButton, ElDivider, ElLoading, ElMessage, ElText } from "element-plus"
import { defineComponent, ref, watch } from "vue"
import metaService from "@service/meta-service"
import processor from "@src/common/backup/processor"
import { formatTime } from "@util/time"
import Download from "./Download"
import Clear from "./Clear"

async function handleBackup(lastTime: Ref<number>) {
    const loading = ElLoading.service({
        text: "Doing backup...."
    })
    const result = await processor.syncData()
    loading.close()
    if (result.success) {
        ElMessage.success('Successfully!')
        lastTime.value = result.data || Date.now()
    } else {
        ElMessage.error(result.errorMsg || 'Unknown error')
    }
}

const TIME_FORMAT = t(msg => msg.calendar.timeFormat)

const _default = defineComponent({
    props: {
        type: {
            type: String as PropType<timer.backup.Type>,
            required: false,
        }
    },
    setup(props) {
        const lastTime: Ref<number> = ref(undefined)

        const queryLastTime = async () => {
            const backInfo = await metaService.getLastBackUp(props.type)
            lastTime.value = backInfo?.ts
        }

        queryLastTime()
        watch(() => props.type, queryLastTime)

        async function handleTest() {
            const loading = ElLoading.service({ text: "Please wait...." });
            try {
                const { errorMsg } = await processor.checkAuth();
                if (!errorMsg) {
                    ElMessage.success("Valid!");
                } else {
                    ElMessage.error(errorMsg);
                }
            } finally {
                loading.close();
            }
        }

        return () => <div>
            <ElDivider />
            <div class="backup-footer">
                <ElButton
                    onClick={handleTest}
                    icon={<RefreshRight />}
                    style={{ marginRight: "12px" }}
                >
                    {t((msg) => msg.option.backup.test)}
                </ElButton>
                <Clear />
                <Download />
                <ElButton
                    type="primary"
                    icon={<UploadFilled />}
                    onClick={() => handleBackup(lastTime)}
                >
                    {t(msg => msg.option.backup.operation)}
                </ElButton>
                <ElText v-show={!!lastTime.value} style={{ marginLeft: "20px" }}>
                    {
                        t(msg => msg.option.backup.lastTimeTip, { lastTime: formatTime(lastTime.value, TIME_FORMAT) })
                    }
                </ElText>
            </div>
        </div>
    }
})

export default _default
/**
 * Copyright (c) 2023 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import type { PropType, Ref } from "vue"

import { t } from "@app/locale"
import { UploadFilled } from "@element-plus/icons-vue"
import { ElButton, ElLoading, ElMessage, ElText } from "element-plus"
import { defineComponent, h, ref, watch } from "vue"
import metaService from "@service/meta-service"
import processor from "@src/common/backup/processor"
import { formatTime } from "@util/time"

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

        return () => {
            const children = [
                h(ElButton, {
                    type: 'primary',
                    icon: UploadFilled,
                    onClick: () => handleBackup(lastTime)
                }, () => t(msg => msg.option.backup.operation))
            ]
            const lastTimeVal = lastTime.value
            if (lastTimeVal) {
                const tips = t(msg => msg.option.backup.lastTimeTip, {
                    lastTime: formatTime(lastTimeVal, TIME_FORMAT)
                })
                const tipText = h(ElText, { style: { marginLeft: '20px' } }, () => tips)
                children.push(tipText)
            }
            lastTime.value && children.push()
            return h('div', {}, children)
        }
    }
})

export default _default
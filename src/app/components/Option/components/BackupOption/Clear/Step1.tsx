/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { Close, Right } from "@element-plus/icons-vue"
import processor from "@src/common/backup/processor"
import { BIRTHDAY, parseTime } from "@util/time"
import { ElButton, ElMessage } from "element-plus"
import { defineComponent, Ref, ref } from "vue"
import ClientTable from "../ClientTable"

export type StatResult = {
    rowCount: number
    hostCount: number
    client: timer.backup.Client
}

async function fetchStatResult(client: timer.backup.Client): Promise<StatResult> {
    const { id: specCid, maxDate, minDate = BIRTHDAY } = client
    const start = parseTime(minDate)
    const end = maxDate ? parseTime(maxDate) : new Date()
    const remoteRows: timer.stat.Row[] = await processor.query({ specCid, start, end })
    const siteSet: Set<string> = new Set()
    remoteRows?.forEach(row => {
        const { host } = row || {}
        host && siteSet.add(host)
    })
    const rowCount = remoteRows?.length || 0
    const hostCount = siteSet?.size || 0
    return {
        rowCount,
        hostCount,
        client,
    }
}

const _default = defineComponent({
    emits: {
        cancel: () => true,
        next: (_data: StatResult) => true
    },
    setup(_, ctx) {
        const client: Ref<timer.backup.Client> = ref()
        const loading: Ref<boolean> = ref()

        const handleNext = () => {
            const clientVal = client.value
            if (!clientVal) {
                ElMessage.warning(t(msg => msg.option.backup.clientTable.notSelected))
                return
            }
            loading.value = true
            fetchStatResult(clientVal)
                .then(data => ctx.emit('next', data))
                .catch((e: Error) => {
                    ElMessage.error(e.message || 'Unknown error...')
                    console.error(e)
                })
                .finally(() => loading.value = false)
        }

        return () => <>
            <ClientTable onSelect={val => client.value = val} />
            <div class="sop-footer">
                <ElButton
                    type="info"
                    icon={<Close />}
                    onClick={() => ctx.emit("cancel")}
                >
                    {t(msg => msg.button.cancel)}
                </ElButton>
                <ElButton
                    type="primary"
                    icon={<Right />}
                    loading={loading.value}
                    onClick={handleNext}
                >
                    {t(msg => msg.button.next)}
                </ElButton>
            </div>
        </>
    }
})

export default _default
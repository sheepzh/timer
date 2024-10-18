/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { Close, Right } from "@element-plus/icons-vue"
import { useManualRequest } from "@hooks"
import { fillExist } from "@service/components/import-processor"
import processor from "@src/common/backup/processor"
import { BIRTHDAY, parseTime } from "@util/time"
import { ElButton, ElMessage } from "element-plus"
import { defineComponent, Ref, ref } from "vue"
import ClientTable from "../ClientTable"

async function fetchData(client: timer.backup.Client): Promise<timer.imported.Data> {
    const { id: specCid, maxDate, minDate = BIRTHDAY } = client
    const start = parseTime(minDate)
    const end = maxDate ? parseTime(maxDate) : new Date()
    const remoteRows: timer.stat.Row[] = await processor.query({ specCid, start, end })
    const rows: timer.imported.Row[] = (remoteRows || []).map(rr => ({
        date: rr.date,
        host: rr.host,
        focus: rr.focus,
        time: rr.time
    }))
    await fillExist(rows)
    return { rows, focus: true, time: true }
}

const _default = defineComponent({
    emits: {
        cancel: () => true,
        next: (_data: timer.imported.Data, _client: timer.backup.Client) => true
    },
    setup(_, ctx) {
        const client: Ref<timer.backup.Client> = ref()

        const { loading, refresh: doFetch } = useManualRequest(fetchData, {
            onSuccess: data => ctx.emit('next', data, client.value),
            onError: (e: Error) => ElMessage.error(e.message || 'Unknown error...'),
        })

        const handleNext = () => {
            const clientVal = client.value
            if (!clientVal) {
                ElMessage.warning(t(msg => msg.option.backup.clientTable.notSelected))
                return
            }
            doFetch(clientVal)
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
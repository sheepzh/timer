import { t } from "@app/locale"
import { Close, Right } from "@element-plus/icons-vue"
import optionService from "@service/option-service"
import processor from "@src/common/backup/processor"
import { RELEASE_DATE, parseTime } from "@util/time"
import { ElButton, ElMessage } from "element-plus"
import { defineComponent, Ref, h, ref, nextTick } from "vue"
import ClientTable from "../client-table"

export type StatResult = {
    rowCount: number
    hostCount: number
    client: timer.backup.Client
}

async function fetchStatResult(client: timer.backup.Client): Promise<StatResult> {
    const { id: specCid, maxDate, minDate = RELEASE_DATE } = client
    const start = parseTime(minDate)
    const end = maxDate ? parseTime(maxDate) : new Date()
    const option: timer.option.BackupOption = await optionService.getAllOption()
    const { backupType: type, backupAuths } = option || {}
    const auth = backupAuths?.[type]
    const remoteRows: timer.stat.Row[] = await processor.query(type, auth, { specCid, start, end })
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

        return () => [
            h(ClientTable, {
                onSelect: newVal => client.value = newVal,
            }),
            h('div', { class: 'sop-footer' }, [
                h(ElButton, {
                    type: 'info',
                    icon: Close,
                    onClick: () => ctx.emit('cancel'),
                }, () => t(msg => msg.button.cancel)),
                h(ElButton, {
                    type: 'primary',
                    icon: Right,
                    loading: loading.value,
                    onClick: handleNext
                }, () => t(msg => msg.button.next)),
            ])
        ]
    }
})

export default _default
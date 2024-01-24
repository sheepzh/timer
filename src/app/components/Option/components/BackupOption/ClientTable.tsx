/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { cvt2LocaleTime } from "@app/util/time"
import metaService from "@service/meta-service"
import processor from "@src/common/backup/processor"
import { ElTableRowScope } from "@src/element-ui/table"
import { ElMessage, ElRadio, ElTable, ElTableColumn, ElTag } from "element-plus"
import { defineComponent, ref, Ref, onMounted } from "vue"

const formatTime = (value: timer.backup.Client): string => {
    const { minDate, maxDate } = value || {}
    const min = minDate ? cvt2LocaleTime(minDate) : ''
    const max = maxDate ? cvt2LocaleTime(maxDate) : ''
    return `${min} - ${max}`
}

const _default = defineComponent({
    emits: {
        select: (_: timer.backup.Client) => true,
    },
    setup(_, ctx) {
        const list: Ref<timer.backup.Client[]> = ref([])
        const loading: Ref<boolean> = ref(false)
        const selectedCid: Ref<string> = ref()
        const localCid: Ref<string> = ref()

        onMounted(() => {
            loading.value = true
            processor.listClients()
                .then(res => {
                    if (res.success) {
                        list.value = res.data
                    } else {
                        throw res.errorMsg
                    }
                })
                .catch(e => ElMessage.error(typeof e === 'string' ? e : (e as Error).message || 'Unknown error...'))
                .finally(() => loading.value = false)
            metaService.getCid().then(cid => localCid.value = cid)
        })

        const handleRowSelect = (row: timer.backup.Client) => {
            selectedCid.value = row.id
            ctx.emit("select", row)
        }

        return () => (
            <ElTable data={list.value}
                border
                maxHeight="40vh"
                class="backup-client-table"
                highlightCurrentRow
                onCurrent-change={(row: timer.backup.Client) => handleRowSelect(row)}
                emptyText={loading.value ? 'Loading data ...' : 'Empty data'}
            >
                <ElTableColumn align="center" width={50}>
                    {
                        ({ row }: ElTableRowScope<timer.backup.Client>) => (
                            <ElRadio
                                label={row.id}
                                modelValue={selectedCid.value}
                                onChange={() => handleRowSelect(row)}
                                v-slots={() => ''}
                            />
                        )
                    }
                </ElTableColumn>
                <ElTableColumn
                    label="CID"
                    align="center"
                    headerAlign="center"
                    width={320}
                    formatter={(client: timer.backup.Client) => client.id || '-'}
                />
                <ElTableColumn
                    label={t(msg => msg.option.backup.client, { input: '' })}
                    align="center"
                    headerAlign="center"
                >
                    {
                        ({ row: client }: ElTableRowScope<timer.backup.Client>) => <>
                            {client.name || '-'}
                            <ElTag v-show={localCid.value === client?.id} size="small" type="danger">
                                {t(msg => msg.option.backup.clientTable.current)}
                            </ElTag>
                        </>
                    }
                </ElTableColumn>
                <ElTableColumn
                    label={t(msg => msg.option.backup.clientTable.dataRange)}
                    align="center"
                    headerAlign="center"
                    formatter={formatTime}
                />
            </ElTable>
        )
    },
})

export default _default
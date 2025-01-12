/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import DialogSop, { type SopInstance, type SopStepInstance } from "@app/components/common/DialogSop"
import { t } from "@app/locale"
import { useManualRequest } from "@hooks/index"
import { useState } from "@hooks/useState"
import processor from "@service/backup/processor"
import { fillExist, processImportedData } from "@service/components/import-processor"
import { BIRTHDAY, parseTime } from "@util/time"
import { ElMessage, ElStep, ElSteps } from "element-plus"
import { defineComponent, ref } from "vue"
import ClientTable from "../ClientTable"
import Step2 from "./Step2"

async function fetchData(client: timer.backup.Client): Promise<timer.imported.Data> {
    const { id: specCid, maxDate, minDate = BIRTHDAY } = client
    const start = parseTime(minDate)
    const end = maxDate ? parseTime(maxDate) : new Date()
    const remoteRows = await processor.query({ specCid, start, end })
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
        download: () => true,
    },
    setup(_, ctx) {
        const [step, setStep] = useState<0 | 1>(0)
        const [client, setClient] = useState<timer.backup.Client>()
        const step2 = ref<SopStepInstance<timer.imported.ConflictResolution>>()

        const init = () => {
            setStep(0)
            setClient()
        }

        ctx.expose({ init } satisfies SopInstance)

        const { data, refresh: handleNext, loading: dataFetching } = useManualRequest(() => {
            if (step.value !== 0) return

            const clientVal = client.value
            if (!clientVal) throw new Error(t(msg => msg.option.backup.clientTable.notSelected))
            return fetchData(clientVal)
        }, {
            onSuccess: () => step.value = 1,
            onError: (e: Error) => ElMessage.error(e.message || 'Unknown error...'),
        })

        const { refresh: handleDownload, loading: downloading } = useManualRequest(async () => {
            const resolution = await step2.value?.parseData?.()
            if (!resolution) throw new Error(t(msg => msg.dataManage.importOther.conflictNotSelected))

            await processImportedData(data.value, resolution)
        }, {
            onSuccess: () => {
                ElMessage.success(t(msg => msg.operation.successMsg))
                ctx.emit('download')
            },
            onError: (e: Error) => ElMessage.error(e.message || 'Unknown error...'),
        })

        return () => (
            <DialogSop
                first={step.value === 0}
                last={step.value === 1}
                onNext={handleNext}
                nextLoading={dataFetching.value}
                onCancel={() => ctx.emit('cancel')}
                onBack={init}
                onFinish={handleDownload}
                finishLoading={downloading.value}
                v-slots={{
                    steps: () => (
                        <ElSteps finishStatus="success" active={step.value} alignCenter>
                            <ElStep title={t(msg => msg.option.backup.clientTable.selectTip)} />
                            <ElStep title={t(msg => msg.option.backup.download.step2)} />
                        </ElSteps>
                    ),
                    content: () =>
                        step.value === 0
                            ? <ClientTable onSelect={setClient} />
                            : <Step2
                                ref={step2}
                                data={data.value}
                                clientName={client.value?.name}
                            />
                }}
            />
        )
    }
})

export default _default
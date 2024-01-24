/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { ElAlert, ElButton, ElMessage } from "element-plus"
import { PropType, Ref, defineComponent, ref } from "vue"
import { Back, Check } from "@element-plus/icons-vue"
import { StatResult } from "./Step1"
import processor from "@src/common/backup/processor"

const processClear = async (client: timer.backup.Client): Promise<void> => {
    const result = await processor.clear(client.id)
    if (!result.success) {
        throw new Error(result.errorMsg)
    }
}

const _default = defineComponent({
    props: {
        data: Object as PropType<StatResult>,
    },
    emits: {
        back: () => true,
        clear: () => true,
    },
    setup(props, ctx) {
        const deleting: Ref<boolean> = ref(false)

        const handleClear = () => {
            deleting.value = true
            processClear(props.data.client)
                .then(() => {
                    ElMessage.success(t(msg => msg.operation.successMsg))
                    ctx.emit('clear')
                })
                .catch((e: Error) => ElMessage.warning(e.message || 'Unknown error'))
                .finally(() => deleting.value = false)
        }

        return () => <>
            <ElAlert type="success" closable={false}>
                {t(msg => msg.option.backup.clear.confirmTip, {
                    ...props.data,
                    clientName: props.data?.client?.name || ''
                })}
            </ElAlert>
            <div class="sop-footer">
                <ElButton
                    type="info"
                    icon={<Back />}
                    disabled={deleting.value}
                    onClick={() => ctx.emit("back")}
                >
                    {t(msg => msg.button.previous)}
                </ElButton>
                <ElButton
                    type="success"
                    icon={<Check />}
                    loading={deleting.value}
                    onClick={handleClear}
                >
                    {t(msg => msg.button.confirm)}
                </ElButton>
            </div>
        </>
    }
})

export default _default
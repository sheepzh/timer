/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { Download } from "@element-plus/icons-vue"
import Flex from "@pages/components/Flex"
import Immigration from "@service/components/immigration"
import { exportJson } from "@util/file"
import { formatTime } from "@util/time"
import { ElAlert, ElButton, ElCard } from "element-plus"
import { defineComponent, type StyleValue } from "vue"
import { alertProps } from "../common"
import ImportButton from "./ImportButton"
import ImportOtherButton from "./ImportOtherButton"

const immigration: Immigration = new Immigration()

async function handleExport() {
    const data = await immigration.getExportingData()
    const timestamp = formatTime(new Date(), '{y}{m}{d}_{h}{i}{s}')
    exportJson(data, `timer_backup_${timestamp}`)
}

const _default = defineComponent({
    emits: {
        import: () => true
    },
    setup(_, ctx) {
        const handleImported = () => ctx.emit("import")
        return () => (
            <ElCard
                style={{ width: '100%' } satisfies StyleValue}
                bodyStyle={{ height: '100%', boxSizing: 'border-box' } as StyleValue}
            >
                <Flex justify="center" height="100%" align="center">
                    <Flex
                        column
                        gap={20}
                        height="100%"
                        maxWidth={190}
                        flex={3}
                    >
                        <ElAlert style={{ flex: 1 }} {...alertProps} >
                            {t(msg => msg.dataManage.migrationAlert)}
                        </ElAlert>
                        <ElButton
                            size="large"
                            type="success"
                            icon={<Download />}
                            onClick={handleExport}
                            style={{ flex: 1 }}
                        >
                            {t(msg => msg.item.operation.exportWholeData)}
                        </ElButton>
                        <ImportButton onImport={handleImported} />
                        <ImportOtherButton onImport={handleImported} />
                    </Flex>
                </Flex>
            </ElCard>
        )
    }
})

export default _default

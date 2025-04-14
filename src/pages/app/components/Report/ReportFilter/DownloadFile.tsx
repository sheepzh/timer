/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { useCategories } from "@app/context"
import { Download } from "@element-plus/icons-vue"
import statService from "@service/stat-service"
import { ElButton, ElDropdown, ElDropdownItem, ElDropdownMenu, ElIcon } from "element-plus"
import { defineComponent } from "vue"
import { cvtOption2Param } from "../common"
import { useReportFilter } from "../context"
import { exportCsv, exportJson } from "../file-export"
import { ICON_BTN_STYLE } from "./common"

const ALL_FILE_FORMATS = ["json", "csv"] as const
type FileFormat = typeof ALL_FILE_FORMATS[number]

const DownloadFile = defineComponent(() => {
    const filter = useReportFilter()
    const { categories } = useCategories()

    const handleDownload = async (format: FileFormat) => {
        const categoriesVal = categories.value
        const param = cvtOption2Param(filter)
        const rows = await statService.select(param, true)
        format === 'json' && exportJson(filter, rows, categoriesVal)
        format === 'csv' && exportCsv(filter, rows, categoriesVal)
    }

    return () => (
        <ElDropdown
            showTimeout={100}
            v-slots={{
                dropdown: () => <ElDropdownMenu>
                    {ALL_FILE_FORMATS.map(f =>
                        <ElDropdownItem onClick={() => handleDownload(f)}>
                            {f}
                        </ElDropdownItem>
                    )}
                </ElDropdownMenu>
            }}
        >
            <ElButton size="small" style={ICON_BTN_STYLE}>
                <ElIcon size={17} style={{ padding: "0 1px" }}>
                    <Download />
                </ElIcon>
            </ElButton>
        </ElDropdown>
    )
})

export default DownloadFile
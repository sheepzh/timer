/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Download } from "@element-plus/icons-vue"
import { ElButton, ElDropdown, ElDropdownItem, ElDropdownMenu, ElIcon } from "element-plus"
import { defineComponent } from "vue"

const ALL_FILE_FORMATS: FileFormat[] = ["json", "csv"]

const _default = defineComponent({
    emits: {
        download: (_format: FileFormat) => true,
    },
    setup(_, ctx) {
        const handleClick = (format: FileFormat) => ctx.emit('download', format)
        return () => (
            <ElDropdown
                class="export-dropdown"
                showTimeout={100}
                v-slots={{
                    dropdown: () => <ElDropdownMenu>
                        {ALL_FILE_FORMATS.map(f =>
                            <ElDropdownItem onClick={() => handleClick(f)}>
                                {f}
                            </ElDropdownItem>
                        )}
                    </ElDropdownMenu>
                }}
            >
                <ElButton size="small" class="record-filter-icon-button">
                    <ElIcon size={17} style={{ padding: "0 1px" }}>
                        <Download />
                    </ElIcon>
                </ElButton>
            </ElDropdown>
        )
    }
})

export default _default
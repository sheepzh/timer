/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Download } from "@element-plus/icons-vue"
import { ElButton, ElDropdown, ElDropdownItem, ElDropdownMenu, ElIcon } from "element-plus"
import { h, defineComponent } from "vue"

const ALL_FILE_FORMATS: FileFormat[] = ["json", "csv"]

const _default = defineComponent({
    name: "FileDownload",
    emits: {
        download: (_format: FileFormat) => true,
    },
    setup(_, ctx) {
        return () => h(ElDropdown, { class: 'export-dropdown', showTimeout: 100 }, {
            default: () => h(ElButton,
                { size: 'small', class: 'export-dropdown-button' },
                () => h(ElIcon, { size: 17, style: { padding: '0 1px' } }, () => h(Download))
            ),
            dropdown: () => h(ElDropdownMenu, {},
                () => ALL_FILE_FORMATS.map(
                    format => h(ElDropdownItem, {
                        onClick: () => ctx.emit("download", format)
                    }, () => format)
                )
            )
        })
    }
})

export default _default
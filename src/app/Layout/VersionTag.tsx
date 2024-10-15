/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import packageInfo from "@src/package"
import { defineComponent } from "vue"

const _default = defineComponent(() => {
    return () => (
        <div class="version-tag hidden-md-and-down">
            <p style={{ fontSize: "10px" }}>
                {`v${packageInfo.version}`}
            </p>
        </div>
    )
})

export default _default
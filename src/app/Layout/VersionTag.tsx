/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { StyleValue, defineComponent } from "vue"
import packageInfo from "@src/package"

const style: StyleValue = {
    width: '100px',
    right: '10px',
    bottom: '-10px',
    position: 'fixed',
    textAlign: 'right',
    color: '#888',
    fontSize: '8px'
}

const _default = defineComponent(() => {
    return () => (
        <div class="version-tag hidden-md-and-down" style={style}>
            <p style={{ fontSize: "10px" }}>
                {`v${packageInfo.version}`}
            </p>
        </div>
    )
})

export default _default
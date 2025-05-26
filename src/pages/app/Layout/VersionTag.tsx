/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import packageInfo from "@src/package"
import type { FunctionalComponent, StyleValue } from "vue"

const STYLE: StyleValue = {
    position: 'fixed',
    width: '100px',
    bottom: '-10px',
    right: '10px',
    textAlign: 'right',
    color: '#888',
    fontSize: '8px',
}

const VersionTag: FunctionalComponent = () => (
    <div class="hidden-md-and-down" style={STYLE}>
        <p style={{ fontSize: "10px" }}>
            {`v${packageInfo.version}`}
        </p>
    </div>
)

export default VersionTag
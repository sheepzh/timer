/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { defineComponent, h } from "vue"
import packageInfo from "@src/package"

const style: Partial<CSSStyleDeclaration> = {
    width: '100px',
    right: '10px',
    bottom: '-10px',
    position: 'fixed',
    textAlign: 'right',
    color: '#888',
    fontSize: '8px'
}

const _default = defineComponent(() => {
    return () => h('div', { style }, h('p', { style: { fontSize: '10px' } }, `v${packageInfo.version}`))
})

export default _default
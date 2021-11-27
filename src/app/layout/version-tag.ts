import { defineComponent, h } from "vue"
import { version } from '../../../package.json'

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
    return () => h('div', { style }, h('p', { style: { fontSize: '10px' } }, `v${version}`))
})

export default _default
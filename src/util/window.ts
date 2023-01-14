import { onMounted, onUnmounted } from "vue"

/**
 * handle window visible change
 * 
 * @since 1.4.4
 */
export function handleWindowVisibleChange(handler: () => void) {
    const hanlderInner = () => document.visibilityState === 'visible' && handler()
    onMounted(() => document.addEventListener('visibilitychange', hanlderInner))
    onUnmounted(() => document.removeEventListener('visibilitychange', hanlderInner))
}

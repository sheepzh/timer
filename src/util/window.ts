import { onMounted, onUnmounted } from "vue"

/**
 * handle window visible change
 *
 * @since 1.4.4
 */
export function handleWindowVisibleChange(handler: () => void) {
    const handlerInner = () => document.visibilityState === 'visible' && handler()
    onMounted(() => document.addEventListener('visibilitychange', handlerInner))
    onUnmounted(() => document.removeEventListener('visibilitychange', handlerInner))
}

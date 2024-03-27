import { onMounted, onUnmounted } from "vue"

export const useWindowVisible = (handler: () => void) => {
    const handlerInner = () => document?.visibilityState === 'visible' && handler?.()
    onMounted(() => document.addEventListener('visibilitychange', handlerInner))
    onUnmounted(() => document.removeEventListener('visibilitychange', handlerInner))
}
import { onMounted, onUnmounted, ref } from "vue"

type Props = {
    onVisible?: () => void
    onHidden?: () => void
}

export const useWindowVisible = (props?: Props) => {
    const { onVisible, onHidden } = props || {}

    const visible = ref(document?.visibilityState === 'visible')

    const handler = () => {
        const current = document?.visibilityState === 'visible'
        !visible.value && current && onVisible?.()
        visible.value && !current && onHidden?.()
        visible.value = current
    }

    onMounted(() => document.addEventListener('visibilitychange', handler))
    onUnmounted(() => document.removeEventListener('visibilitychange', handler))

    return visible
}
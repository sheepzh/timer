import { Ref, onMounted, ref } from "vue"

type Option<T> = {
    manual?: boolean
    defaultValue?: T
}

type Result<T> = {
    data: Ref<T>
    refresh: () => void
    refreshAsync: () => Promise<void>
    loading: Ref<boolean>
}

export const useRequest = <T,>(getter: () => Promise<T> | T, option?: Option<T>): Result<T> => {
    const { manual = false, defaultValue } = option || {}
    const data: Ref<T> = ref(defaultValue) as Ref<T>
    const loading = ref(false)

    const refreshAsync = async () => {
        loading.value = true
        try {
            const value = await getter?.()
            data.value = value
        } finally {
            loading.value = false
        }
    }
    const refresh = () => { refreshAsync() }
    if (!manual) onMounted(refresh)
    return { data, refresh, refreshAsync, loading }
}
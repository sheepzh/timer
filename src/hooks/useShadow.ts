import { Ref, WatchSource, ref, watch } from "vue"

export const useShadow = <T,>(source: WatchSource<T>, defaultValue?: T): Ref<T> => {
    const getVal = () => typeof source === "function" ? source() : source?.value
    const shadow: Ref<T> = ref(getVal() || defaultValue) as Ref<T>
    watch(source, () => shadow.value = getVal())
    return shadow
}
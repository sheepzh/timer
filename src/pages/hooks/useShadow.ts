import { type Ref, type WatchSource, ref, watch } from "vue"

export const useShadow = <T,>(source: WatchSource<T>, defaultValue?: T): [Ref<T>, setter: (val?: T) => void, refresh: () => void] => {
    const getVal = () => typeof source === "function" ? source() : source?.value
    const shadow: Ref<T> = ref(getVal() ?? defaultValue) as Ref<T>
    watch(source, () => shadow.value = getVal())
    return [shadow, (val?: T) => shadow.value = val, () => shadow.value = getVal()]
}
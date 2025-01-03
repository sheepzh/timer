import { type Ref, ref } from "vue"

export const useState = <T,>(defaultValue?: T): [state: Ref<T>, setter: (val?: T) => void, reset: () => void] => {
    const result = ref<T>(defaultValue) as Ref<T>
    const setter = (val?: T) => result.value = val
    return [result, setter, () => setter(defaultValue)]
}
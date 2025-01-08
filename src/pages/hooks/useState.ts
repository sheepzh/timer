import { type Ref, shallowRef } from "vue"

export const useState = <T,>(defaultValue?: T): [state: Ref<T>, setter: (val?: T) => void, reset: () => void] => {
    const result = shallowRef<T>(defaultValue)
    const setter = (val?: T) => result.value = val
    return [result, setter, () => setter(defaultValue)]
}
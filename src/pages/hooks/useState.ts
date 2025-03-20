import { ref, type Ref, shallowRef } from "vue"

export const useState = <T,>(defaultValue?: T):
    | [state: Ref<T>, setter: (val: T) => void, reset: () => void]
    | [state: Ref<T | undefined>, setter: (val?: T) => void, reset: () => void] => {
    if (defaultValue === undefined || defaultValue === null) {
        const result = ref<T>()
        return [
            result,
            (val?: T) => result.value = val,
            () => result.value = undefined
        ]
    } else {
        const result = shallowRef<T>(defaultValue)
        return [
            result,
            (val: T) => result.value = val,
            () => result.value = defaultValue
        ]
    }
}
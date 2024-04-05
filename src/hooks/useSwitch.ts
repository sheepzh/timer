import { Ref, ref } from "vue"

export const useSwitch = (defaultValue?: boolean):
    [ref: Ref<boolean>, open: () => void, close: () => void] => {
    const value = ref(defaultValue || false)
    return [value, () => value.value = true, () => value.value = false]
}
import optionHolder from "@service/components/option-holder"
import { onBeforeMount, reactive, toRaw, UnwrapRef, watch } from "vue"

type Options<T> = {
    defaultValue: () => T
    copy: (target: T, source: T) => void
    onChange?: (newVal: T) => void
}

export const useOption = <T extends object = Partial<timer.option.AllOption>>(options: Options<T>) => {
    const { defaultValue, copy, onChange } = options
    const option: UnwrapRef<object> = reactive<T>(defaultValue?.())

    onBeforeMount(async () => {
        const currentVal = await optionHolder.get() as T
        copy(option as T, currentVal)
        watch(option, async () => {
            const newVal = toRaw(option) as T
            await optionHolder.set(newVal)
            onChange?.(newVal)
        })
    })

    return { option: option as UnwrapRef<T> }
}
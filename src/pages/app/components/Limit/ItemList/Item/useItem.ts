import { useProvide, useProvider } from "@hooks/index"
import { Reactive, reactive, type Ref } from "vue"

type Context = {
    data: Reactive<timer.limit.Item>
    selected: Ref<boolean>
}

const NAME_SPACE = 'limit_item'

export const provideItem = (
    value: timer.limit.Item,
    selected: Ref<boolean>,
): void => {
    const data = reactive(value)

    useProvide(NAME_SPACE, { data, selected } satisfies Context)
}


export const useItem = () => useProvider<Context, 'data' | 'selected'>(NAME_SPACE, 'data', 'selected')
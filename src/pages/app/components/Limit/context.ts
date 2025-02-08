import { useProvide, useProvider, useState } from "@hooks"
import { type Ref } from "vue"
import type { LimitFilterOption } from "./types"

type Context = {
    filter: Ref<LimitFilterOption>
}

const NAMESPACE = 'limit'

export const initProvider = (defaultFilter: LimitFilterOption) => {
    const [filter, setFilter] = useState<LimitFilterOption>(defaultFilter)
    useProvide<Context>(NAMESPACE, { filter })

    return { filter, setFilter }
}

export const useLimitFilter = (): Ref<LimitFilterOption> => useProvider<Context>(NAMESPACE, "filter").filter

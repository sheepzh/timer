import { useProvide, useProvider } from "@hooks"
import { type Ref } from "vue"
import type { LimitFilterOption } from "./types"

type Context = {
    filter: Ref<LimitFilterOption>
}

const NAMESPACE = 'limit'

export const initProvider = (
    filter: Ref<LimitFilterOption>,
) => useProvide<Context>(NAMESPACE, {
    filter
})

export const useLimitFilter = (): Ref<LimitFilterOption> => useProvider<Context>(NAMESPACE, "filter").filter

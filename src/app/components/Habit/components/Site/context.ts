/**
 * Copyright (c) 2024 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { useProvide, useProvider } from "@app/hooks/useProvider"
import { Ref } from "vue"

type Context = {
    rows: Ref<timer.stat.Row[]>
}

const NAMESPACE = 'habitSite'

export const initProvider = (rows: Ref<timer.stat.Row[]>) => useProvide<Context>(NAMESPACE, { rows })

export const useRows = (): Ref<timer.stat.Row[]> => useProvider<Context>(NAMESPACE, "rows").rows
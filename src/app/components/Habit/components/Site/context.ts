/**
 * Copyright (c) 2024 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { provideWithNs, useProviderWithNs } from "@app/util/provider"
import { Ref } from "vue"

type Context = {
    rows: Ref<timer.stat.Row[]>
}

const NAMESPACE = 'habitSite'

export const initProvider = (rows: Ref<timer.stat.Row[]>) => provideWithNs<Context>(NAMESPACE, { rows })

export const useRows = (): Ref<timer.stat.Row[]> => useProviderWithNs<Context>(NAMESPACE, "rows").rows
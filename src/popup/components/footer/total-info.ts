/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { version } from "../../../../package.json"

const totalInfoSpan: HTMLSpanElement = document.getElementById('total-info') as HTMLSpanElement

export function updateTotal(totalInfo: string): void {
    totalInfoSpan.innerText = `v${version} ${totalInfo}`
}
/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import packageInfo from "@src/package"

const totalInfoSpan: HTMLSpanElement = document.getElementById('total-info') as HTMLSpanElement

export function updateTotal(totalInfo: string): void {
    totalInfoSpan.innerText = `v${packageInfo.version} ${totalInfo}`
}
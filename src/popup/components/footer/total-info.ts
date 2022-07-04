/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import packageInfo from "@src/package"

class TotalInfoWrapper {
    totalInfoSpan: HTMLElement

    constructor() {
        this.totalInfoSpan = document.getElementById('total-info') as HTMLSpanElement
    }

    updateTotal(totalInfo: string): void {
        this.totalInfoSpan.innerText = `v${packageInfo.version} ${totalInfo}`
    }
}

export default TotalInfoWrapper

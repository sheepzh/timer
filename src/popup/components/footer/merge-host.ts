/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@popup/locale"

const CHECKED_CLASS = 'is-checked'

class MergeHostWrapper {
    private mergeHostSwitch: HTMLElement
    private mergeHostPopup: HTMLElement
    private mergeHostPopupInfo: HTMLElement
    private handleChanged: Function

    constructor(handleChanged: Function) {
        this.handleChanged = handleChanged
    }

    init(initialVal: boolean) {
        this.mergeHostSwitch = document.getElementById('merge-host-switch')
        this.mergeHostPopup = document.getElementById('merge-host-popup-container')
        this.mergeHostPopupInfo = document.getElementById('merge-host-popup-info')
        this.mergeHostPopupInfo.innerText = t(msg => msg.chart.mergeHostLabel)
        // Handle hover
        this.mergeHostSwitch.onmouseover = () => this.mergeHostPopup.style.display = 'block'
        this.mergeHostSwitch.onmouseout = () => this.mergeHostPopup.style.display = 'none'
        this.mergeHostSwitch.onclick = () => {
            if (this.mergedHost()) {
                this.mergeHostSwitch.classList.remove(CHECKED_CLASS)
            } else {
                this.mergeHostSwitch.classList.add(CHECKED_CLASS)
            }
            this.handleChanged?.()
        }
        initialVal && this.mergeHostSwitch.click()
    }

    mergedHost() {
        return this.mergeHostSwitch.classList.contains(CHECKED_CLASS)
    }
}

export default MergeHostWrapper
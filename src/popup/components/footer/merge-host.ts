/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "../../locale"

const mergeHostSwitch = document.getElementById('merge-host-switch')
const mergeHostPopup = document.getElementById('merge-host-popup-container')
const mergeHostPopupInfo = document.getElementById('merge-host-popup-info')
mergeHostPopupInfo.innerText = t(msg => msg.mergeHostLabel)

mergeHostSwitch.onmouseover = () => mergeHostPopup.style.display = 'block'
mergeHostSwitch.onmouseout = () => mergeHostPopup.style.display = 'none'

const CHECKED_CLASS = 'is-checked'
mergeHostSwitch.onclick = () => {
    if (mergedHost()) {
        mergeHostSwitch.classList.remove(CHECKED_CLASS)
    } else {
        mergeHostSwitch.classList.add(CHECKED_CLASS)
    }
    handleChanged && handleChanged()
}

export const mergedHost = () => mergeHostSwitch.classList.contains(CHECKED_CLASS)

let handleChanged: () => void
function _default(handleChanged_: () => void) {
    handleChanged = handleChanged_
}

export default _default
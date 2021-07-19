import { t } from "../../locale"

const mergeDomainSwitch = document.getElementById('merge-domain-switch')
const mergeDomainPopup = document.getElementById('merge-domain-popup-container')
const mergeDomainPopupInfo = document.getElementById('merge-domain-popup-info')
mergeDomainPopupInfo.innerText = t(msg => msg.mergeDomainLabel)

mergeDomainSwitch.onmouseover = () => mergeDomainPopup.style.display = 'block'
mergeDomainSwitch.onmouseout = () => mergeDomainPopup.style.display = 'none'

const CHECKED_CLASS = 'is-checked'
mergeDomainSwitch.onclick = () => {
    if (mergedDomain()) {
        mergeDomainSwitch.classList.remove(CHECKED_CLASS)
    } else {
        mergeDomainSwitch.classList.add(CHECKED_CLASS)
    }
    handleChanged && handleChanged()
}

export const mergedDomain = () => mergeDomainSwitch.classList.contains(CHECKED_CLASS)

let handleChanged: () => void
function _default(handleChanged_: () => void) {
    handleChanged = handleChanged_
}

export default _default
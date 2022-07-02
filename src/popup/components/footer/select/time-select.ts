/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

// Time select
import { t } from "@popup/locale"
import optionService from "@service/option-service"
import { ALL_POPUP_DURATION } from "@util/constant/popup"
import { toHideStyle, toShowStyle } from "./common"

const timeSelect = document.getElementById('time-select-container')
const timeSelectPopup = document.getElementById('time-select-popup')
const timeSelectInput: HTMLInputElement = document.getElementById('time-select-input') as HTMLInputElement

let isOpen = false

function openPopup() {
    // Show popup
    Object.assign(timeSelectPopup.style, toShowStyle)
    isOpen = true
}

function hidePopup() {
    // Hide popup
    Object.assign(timeSelectPopup.style, toHideStyle)
    isOpen = false
}

timeSelect.onclick = () => isOpen ? hidePopup() : openPopup()

/////////// Options
const SELECTED_CLASS = 'selected'
const optionList = document.getElementById('time-select-options')
const optionItems: Map<timer.PopupDuration, HTMLLIElement> = new Map()

function selected(item: timer.PopupDuration): void {
    currentSelected = item
    Array.from(optionItems.values()).forEach(item => item.classList.remove(SELECTED_CLASS))
    optionItems.get(item).classList.add(SELECTED_CLASS)
    timeSelectInput.value = t(msg => msg.timeDuration[item])
}

for (const item of ALL_POPUP_DURATION) {
    const li = document.createElement('li')
    li.classList.add('el-select-dropdown__item')
    li.innerText = t(msg => msg.timeDuration[item])
    li.onclick = () => {
        selected(item)
        handleSelected && handleSelected()
        hidePopup()
    }
    optionList.append(li)
    optionItems.set(item, li)
}
let currentSelected: timer.PopupDuration = undefined

export function getSelectedTime(): timer.PopupDuration {
    return currentSelected
}

optionService.getAllOption().then((option: timer.option.PopupOption) => selected(option.defaultDuration))

let handleSelected: () => void
function _default(handleSelected_: () => void) {
    handleSelected = handleSelected_
}
export default _default
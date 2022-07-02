/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

// Type select
import { ALL_DATA_ITEMS } from "@entity/dto/data-item"
import optionService from "@service/option-service"
import { t } from "@popup/locale"
import { toHideStyle, toShowStyle } from "./common"

const typeSelect = document.getElementById('type-select-container')
const typeSelectPopup = document.getElementById('type-select-popup')
const typeSelectInput: HTMLInputElement = document.getElementById('type-select-input') as HTMLInputElement

let isOpen = false

function openPopup() {
    // Show popup
    Object.assign(typeSelectPopup.style, toShowStyle)
    isOpen = true
}

function hidePopup() {
    // Hide popup
    Object.assign(typeSelectPopup.style, toHideStyle)
    isOpen = false
}

typeSelect.onclick = () => isOpen ? hidePopup() : openPopup()

/////////// Options
const SELECTED_CLASS = 'selected'
const optionList = document.getElementById('type-select-options')
const optionItems: Map<timer.DataDimension, HTMLLIElement> = new Map()

function selected(item: timer.DataDimension): void {
    currentSelected = item
    Array.from(optionItems.values()).forEach(item => item.classList.remove(SELECTED_CLASS))
    optionItems.get(item).classList.add(SELECTED_CLASS)
    typeSelectInput.value = t(msg => msg.item[item])
}

for (const item of ALL_DATA_ITEMS) {
    const li = document.createElement('li')
    li.classList.add('el-select-dropdown__item')
    li.innerText = t(msg => msg.item[item])
    li.onclick = () => {
        selected(item)
        handleSelected && handleSelected()
        hidePopup()
    }
    optionList.append(li)
    optionItems.set(item, li)
}
let currentSelected: timer.DataDimension = undefined

export function getSelectedType(): timer.DataDimension { return currentSelected }

optionService.getAllOption().then((option: timer.option.PopupOption) => selected(option.defaultType))

let handleSelected: () => void
function _default(handleSelected_: () => void) {
    handleSelected = handleSelected_
}
export default _default
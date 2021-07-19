// Type select
import { ALL_SITE_ITEMS, SiteItem } from "../../../entity/dto/site-info"
import { t } from "../../locale"

const typeSelect = document.getElementById('select-container')
const typeSelectPopup = document.getElementById('type-select-popup')
const typeSelectInput: HTMLInputElement = document.getElementById('type-select-input') as HTMLInputElement

const arrowIcon = document.getElementById('select-arrow')

const ARROW_UP = 'el-icon-arrow-up'
const ARROW_DOWN = 'el-icon-arrow-down'
let isOpen = false

const toShowStyle: Partial<CSSStyleDeclaration> = {
    display: 'block',
    position: 'absolute',
}
function openPopup() {
    // Show popup
    Object.assign(typeSelectPopup.style, toShowStyle)
    // Change the icon
    arrowIcon.classList.remove(ARROW_UP)
    arrowIcon.classList.add(ARROW_DOWN)

    isOpen = true
}

const toHideStyle: Partial<CSSStyleDeclaration> = {
    display: 'none'
}
function hidePopup() {
    // Show popup
    Object.assign(typeSelectPopup.style, toHideStyle)
    // Change the icon
    arrowIcon.classList.remove(ARROW_DOWN)
    arrowIcon.classList.add(ARROW_UP)

    isOpen = false
}

typeSelect.onclick = () => isOpen ? hidePopup() : openPopup()

/////////// Options
const SELECTED_CLASS = 'selected'
const optionList = document.getElementById('type-select-options')
const optionItems: Map<SiteItem, HTMLLIElement> = new Map()

function selected(item: SiteItem): void {
    currentSelected = item
    Array.from(optionItems.values()).forEach(item => item.classList.remove(SELECTED_CLASS))
    optionItems.get(item).classList.add(SELECTED_CLASS)
    typeSelectInput.value = t(msg => msg.item[item])
}

for (const item of ALL_SITE_ITEMS) {
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
let currentSelected: SiteItem = undefined

export function getSelectedType(): SiteItem { return currentSelected }

selected('focus')

let handleSelected: () => void
function _default(handleSelected_: () => void) {
    handleSelected = handleSelected_
}
export default _default
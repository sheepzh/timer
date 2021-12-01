// Type select
import { ALL_SITE_ITEMS } from "../../../entity/dto/site-info"
import optionService from "../../../service/option-service"
import { t } from "../../locale"

const typeSelect = document.getElementById('select-container')
const typeSelectPopup = document.getElementById('type-select-popup')
const typeSelectInput: HTMLInputElement = document.getElementById('type-select-input') as HTMLInputElement

let isOpen = false

const toShowStyle: Partial<CSSStyleDeclaration> = {
    display: 'block',
    position: 'absolute',
}
function openPopup() {
    // Show popup
    Object.assign(typeSelectPopup.style, toShowStyle)
    isOpen = true
}

const toHideStyle: Partial<CSSStyleDeclaration> = {
    display: 'none'
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
const optionItems: Map<Timer.SiteItem, HTMLLIElement> = new Map()

function selected(item: Timer.SiteItem): void {
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
let currentSelected: Timer.SiteItem = undefined

export function getSelectedType(): Timer.SiteItem { return currentSelected }

optionService.getAllOption().then((option: Timer.PopupOption) => selected(option.defaultType))

let handleSelected: () => void
function _default(handleSelected_: () => void) {
    handleSelected = handleSelected_
}
export default _default
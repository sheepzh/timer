/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

// Type select
import { ALL_DIMENSIONS } from "@util/stat"
import { t } from "@popup/locale"

const SELECTED_CLASS = "selected"
class TypeSelectWrapper {
    private typeSelect: HTMLElement
    private typeSelectPopup: HTMLElement
    private typeSelectInput: HTMLInputElement
    private isOpen: boolean = false
    private currentSelected: timer.stat.Dimension = undefined
    private handleSelected: Function

    private optionList: HTMLElement
    private optionItems: Map<timer.stat.Dimension, HTMLLIElement> = new Map()

    constructor(handleSelected: Function) {
        this.handleSelected = handleSelected
    }

    async init(initialVal: timer.stat.Dimension) {
        this.typeSelect = document.getElementById('type-select-container')
        this.typeSelectPopup = document.getElementById('type-select-popup')
        this.typeSelectInput = document.getElementById('type-select-input') as HTMLInputElement
        this.optionList = document.getElementById('type-select-options')
        // Handle click
        this.typeSelect.onclick = () => this.isOpen ? this.hidePopup() : this.openPopup()
        // Init options
        ALL_DIMENSIONS.forEach(duration => this.initOption(duration))// Set initial value 
        this.selected(initialVal)
    }

    getSelectedType(): timer.stat.Dimension { return this.currentSelected }

    private openPopup() {
        this.typeSelectPopup.classList.remove("popup__hidden")
        this.typeSelectPopup.classList.add("popup__show")
        this.isOpen = true
    }

    private hidePopup() {
        this.typeSelectPopup.classList.remove("popup__show")
        this.typeSelectPopup.classList.add("popup__hidden")
        this.isOpen = false
    }
    private initOption(item: timer.stat.Dimension) {
        const li = document.createElement('li')
        li.classList.add('el-select-dropdown__item')
        li.innerText = t(msg => msg.item[item])
        li.onclick = () => {
            this.selected(item)
            this.handleSelected?.()
            this.hidePopup()
        }
        this.optionList.append(li)
        this.optionItems.set(item, li)
    }

    private selected(item: timer.stat.Dimension): void {
        this.currentSelected = item
        Array.from(this.optionItems.values()).forEach(item => item.classList.remove(SELECTED_CLASS))
        this.optionItems.get(item).classList.add(SELECTED_CLASS)
        this.typeSelectInput.value = t(msg => msg.item[item])
    }
}

export default TypeSelectWrapper
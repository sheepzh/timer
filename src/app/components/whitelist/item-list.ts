/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElMessage, ElMessageBox } from "element-plus"
import { t } from "@app/locale"
import { h, ref, Ref, VNode } from "vue"
import whitelistService from "@service/whitelist-service"
import Item from './components/item'
import AddButton from './components/add-button'

const whitelistRef: Ref<string[]> = ref([])

function queryData() {
    whitelistService.listAll().then(list => whitelistRef.value = list)
}

queryData()

const handleClose = (whiteItem: string) => {
    const confirmMsg = t(msg => msg.whitelist.removeConfirmMsg, { url: whiteItem })
    const confirmTitle = t(msg => msg.operation.confirmTitle)
    ElMessageBox
        .confirm(confirmMsg, confirmTitle, { dangerouslyUseHTMLString: true })
        .then(() => whitelistService.remove(whiteItem))
        .then(() => {
            ElMessage({ type: 'success', message: t(msg => msg.operation.successMsg) })
            const index = whitelistRef.value.indexOf(whiteItem)
            index !== -1 && whitelistRef.value.splice(index, 1)
        })
        .catch(() => { })
}

async function handleChanged(inputValue: string, index: number, ref: Ref) {
    const duplicate = whitelistRef.value.find((white, i) => white === inputValue && i !== index)
    if (duplicate) {
        ElMessage({ type: 'warning', message: t(msg => msg.whitelist.duplicateMsg) })
        // Reopen
        ref.value.forceEdit()
        return
    }
    await whitelistService.remove(whitelistRef.value[index])
    await whitelistService.add(inputValue)
    whitelistRef.value[index] = inputValue
    ElMessage({ type: 'success', message: t(msg => msg.operation.successMsg) })
}

function handleAdd(inputValue: string, ref: Ref) {
    const whitelist = whitelistRef.value
    const exists = whitelist.filter(item => item === inputValue).length > 0
    if (exists) {
        ElMessage.warning(t(msg => msg.whitelist.duplicateMsg))
        return
    }
    const msg = t(msg => msg.whitelist.addConfirmMsg, { url: inputValue })
    const title = t(msg => msg.operation.confirmTitle)
    ElMessageBox.confirm(msg, title, { dangerouslyUseHTMLString: true })
        .then(async () => {
            await whitelistService.add(inputValue)
            whitelist.push(inputValue)
            ElMessage({ type: 'success', message: t(msg => msg.operation.successMsg) })
            ref.value.closeEdit()
        }).catch(() => { })
}

function tags(): VNode {
    const result = []
    whitelistRef.value.forEach((white: string, index: number) => {
        const itemRef: Ref = ref()
        const item = h(Item, {
            white, index, ref: itemRef,
            onChanged: (newVal, index) => handleChanged(newVal, index, itemRef),
            onDeleted: (val: string) => handleClose(val)
        })
        result.push(item)
    })
    const addButtonRef: Ref = ref()
    result.push(h(AddButton, {
        ref: addButtonRef,
        onSaved: (inputVal: string) => handleAdd(inputVal, addButtonRef)
    }))
    return h('div', { class: 'editable-tag-container' }, result)
}

export default tags
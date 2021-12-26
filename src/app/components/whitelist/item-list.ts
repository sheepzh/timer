/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElButton, ElInput, ElMessage, ElMessageBox, ElTag } from "element-plus"
import { t } from "@app/locale"
import { h, ref, Ref, VNode } from "vue"
import whitelistService from "@service/whitelist-service"

const whitelistRef: Ref<string[]> = ref([])
whitelistService
    .listAll()
    .then(list => whitelistRef.value = list)
const inputVisibleRef: Ref<boolean> = ref(false)
const inputValRef: Ref<string> = ref('')

const handleInputSave = (inputValue: string) => {
    const whitelist = whitelistRef.value
    if (whitelist.includes(inputValue)) {
        ElMessage({ type: 'warning', message: t(msg => msg.whitelist.duplicateMsg) })
        return
    }
    const msg = t(msg => msg.whitelist.addConfirmMsg, { url: inputValue })
    const title = t(msg => msg.operation.confirmTitle)
    ElMessageBox.confirm(msg, title, { dangerouslyUseHTMLString: true })
        .then(() => whitelistService.add(inputValue))
        .then(() => {
            whitelist.push(inputValue)
            ElMessage({ type: 'success', message: t(msg => msg.operation.successMsg) })
        }).catch(() => { })
}

const handleInputConfirm = () => {
    const inputValue = inputValRef.value
    inputValue && handleInputSave(inputValue)
    // Clear input anyway
    inputVisibleRef.value = false
    inputValRef.value = ''
}

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
// Render the tag items of whitelist 
const generateTagItems = (whiteItem: string) => h(ElTag,
    {
        class: 'white-item',
        closable: true,
        onClose: () => handleClose(whiteItem)
    },
    () => whiteItem
)

const whiteItemInput = () => h(ElInput,
    {
        class: 'input-new-tag white-item',
        modelValue: inputValRef.value,
        clearable: true,
        placeholder: t(msg => msg.whitelist.placeholder),
        onClear: () => inputValRef.value = '',
        onInput: (val: string) => inputValRef.value = val.trim(),
        onKeyup: (event: KeyboardEvent) => event.key === 'Enter' && handleInputConfirm(),
        onBlur: () => handleInputConfirm()
    }
)

const whiteItemDisplayButton = () => h<{}>(ElButton,
    {
        size: 'small',
        class: 'button-new-tag white-item',
        onClick: () => inputVisibleRef.value = true
    },
    () => `+ ${t(msg => msg.operation.newOne)}`
)

const tags: () => VNode[] = () => {
    const result = []
    result.push(...whitelistRef.value.map(generateTagItems))
    result.push(inputVisibleRef.value ? whiteItemInput() : whiteItemDisplayButton())
    return result
}

export default tags
/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElButton, ElInput, ElMessage, ElMessageBox, ElTag } from "element-plus"
import { MergeRuleMessage } from "@app/locale/components/merge-rule"
import { Ref, ref, h } from "vue"
import MergeRuleDatabase from "@db/merge-rule-database"
import HostMergeRuleItem from "@entity/dto/host-merge-rule-item"
import { isValidHost } from "@util/pattern"
import { t } from "@app/locale"

const mergeRuleDatabase = new MergeRuleDatabase(chrome.storage.local)
const ruleItemsRef: Ref<HostMergeRuleItem[]> = ref([])
mergeRuleDatabase
    .selectAll()
    .then(items => ruleItemsRef.value = [...items])

const inputVisibleRef: Ref<boolean> = ref(false)
const originValRef: Ref<string> = ref('')
const mergedValRef: Ref<string> = ref('')

const handleInputConfirm = () => {
    const origin = originValRef.value
    const merged = mergedValRef.value

    if (!isValidHost(origin)) {
        ElMessage.warning(t(msg => msg.mergeRule.errorOrigin))
        return
    }
    const exists = ruleItemsRef.value.filter(item => item.origin === origin).length > 0
    if (exists) {
        ElMessage.warning(t(msg => msg.mergeRule.duplicateMsg, { origin }))
        return
    }
    let toInsert: HostMergeRuleItem
    if (/^[0-9]+$/.test(merged)) {
        let mergedDotCount = parseInt(merged)
        mergedDotCount < 1 ? (mergedDotCount = 0) : (mergedDotCount--)
        toInsert = { origin, merged: mergedDotCount }
    } else {
        !merged && (merged === '')
        toInsert = { origin, merged }
    }

    ElMessageBox.confirm(
        t(msg => msg.mergeRule.addConfirmMsg, { origin }),
        t(msg => msg.operation.confirmTitle), { dangerouslyUseHTMLString: true }
    ).then(() => mergeRuleDatabase.add(toInsert)
    ).then(() => {
        ruleItemsRef.value.push(toInsert)
        ElMessage({ type: 'success', message: t(msg => msg.operation.successMsg) })
    }).catch(() => { })

    inputVisibleRef.value = false
    originValRef.value = ''
    mergedValRef.value = ''
}

// Render the tag items
const handleTagClose = (ruleItem: HostMergeRuleItem) => {
    const { origin } = ruleItem
    const confirmMsg = t(msg => msg.mergeRule.removeConfirmMsg, { origin })
    const confirmTitle = t(msg => msg.operation.confirmTitle)
    ElMessageBox
        .confirm(confirmMsg, confirmTitle)
        .then(() => mergeRuleDatabase.remove(origin))
        .then(() => {
            ElMessage({ type: 'success', message: t(msg => msg.operation.successMsg) })
            const index = ruleItemsRef.value.indexOf(ruleItem)
            index !== -1 && ruleItemsRef.value.splice(index, 1)
        })
        .catch(() => { })
}

const generateTagItems = (ruleItem: HostMergeRuleItem) => {
    const { origin, merged } = ruleItem
    const type: '' | 'info' | 'success' = typeof merged === 'number' ? 'success' : merged === '' ? 'info' : ''
    const txt = typeof merged === 'number'
        ? t(msg => msg.mergeRule.resultOfLevel, { level: merged + 1 })
        : merged === '' ? t(msg => msg.mergeRule.resultOfOrigin) : merged
    const tagProps = {
        class: 'white-item',
        type,
        closable: true,
        onClose: () => handleTagClose(ruleItem)
    }
    return h(ElTag, tagProps, () => `${origin}  >>>  ${txt}`)
}

const inputVal = (modelValue: Ref<string>, placeholder: keyof MergeRuleMessage) => h(ElInput, {
    class: 'input-new-tag white-item origin-host-input',
    modelValue: modelValue.value,
    placeholder: t(msg => msg.mergeRule[placeholder]),
    clearable: true,
    onClear: () => modelValue.value = '',
    onInput: (val: string) => modelValue.value = val.trim(),
})

const originInputTag = () => inputVal(originValRef, 'originPlaceholder')

const mergedInputTag = () => inputVal(mergedValRef, 'mergedPlaceholder')

const buttonProps = {
    size: 'small',
    class: 'button-new-tag white-item',
    onClick: () => inputVisibleRef.value ? handleInputConfirm() : (inputVisibleRef.value = true)
}
const buttonMessage = () => inputVisibleRef.value ? t(msg => msg.operation.save) : `+ ${t(msg => msg.operation.newOne)}`

const inputButton = () => h<{}>(ElButton, buttonProps, buttonMessage)

const itemList = () => {
    const result = []
    const tags = ruleItemsRef.value.map(generateTagItems)
    result.push(...tags)
    // Display the input
    inputVisibleRef.value && result.push(originInputTag(), mergedInputTag())
    // Click this button to display the input then focus it
    result.push(inputButton())
    return result
}

export default itemList
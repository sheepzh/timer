import { ElButton, ElInput, ElMessage, ElMessageBox, ElTag } from "element-plus"
import { Ref, ref, h } from "vue"
import MergeRuleDatabase from "../../../../database/merge-rule-database"
import DomainMergeRuleItem from "../../../../entity/dto/domain-merge-rule-item"
import { isValidMergeOriginHost } from "../../../../util/pattern"
import { t } from "../../../locale"
import { SettingMessage } from "../../../locale/components/setting"

const mergeRuleDatabase = new MergeRuleDatabase(chrome.storage.local)

const ruleItemsRef: Ref<DomainMergeRuleItem[]> = ref([])

mergeRuleDatabase
    .selectAll()
    .then(items => ruleItemsRef.value = [...items])

const inputVisibleRef: Ref<boolean> = ref(false)
const originValRef: Ref<string> = ref('')
const mergedValRef: Ref<string> = ref('')

const handleInputConfirm = () => {
    const origin = originValRef.value
    const merged = mergedValRef.value

    if (!isValidMergeOriginHost(origin)) {
        ElMessage.warning(t(msg => msg.setting.merge.errorOrigin))
        return
    }
    const exists = ruleItemsRef.value.filter(item => item.origin === origin).length > 0
    if (exists) {
        ElMessage.warning(t(msg => msg.setting.merge.duplicateMsg, { origin }))
        return
    }
    let toInsert: DomainMergeRuleItem
    if (/^[0-9]+$/.test(merged)) {
        let mergedDotCount = parseInt(merged)
        mergedDotCount < 1 ? (mergedDotCount = 0) : (mergedDotCount--)
        toInsert = { origin, merged: mergedDotCount }
    } else {
        !merged && (merged === '')
        toInsert = { origin, merged }
    }

    ElMessageBox.confirm(
        t(msg => msg.setting.merge.addConfirmMsg, { origin }),
        t(msg => msg.setting.confirmTitle), { dangerouslyUseHTMLString: true }
    ).then(() => mergeRuleDatabase.add(toInsert)
    ).then(() => {
        ruleItemsRef.value.push(toInsert)
        ElMessage({ type: 'success', message: t(msg => msg.setting.successMsg) })
    }).catch(() => { })

    inputVisibleRef.value = false
    originValRef.value = ''
    mergedValRef.value = ''
}

// Render the tag items
const handleTagClose = (ruleItem: DomainMergeRuleItem) => {
    const { origin } = ruleItem
    const confirmMsg = t(msg => msg.setting.merge.removeConfirmMsg, { origin })
    const confirmTitle = t(msg => msg.setting.confirmTitle)
    ElMessageBox
        .confirm(confirmMsg, confirmTitle)
        .then(() => mergeRuleDatabase.remove(origin))
        .then(() => {
            ElMessage({ type: 'success', message: t(msg => msg.setting.successMsg) })
            const index = ruleItemsRef.value.indexOf(ruleItem)
            index !== -1 && ruleItemsRef.value.splice(index, 1)
        })
        .catch(() => { })
}
const generateTagItems = (ruleItem: DomainMergeRuleItem) => {
    const { origin, merged } = ruleItem
    const type = typeof merged === 'number' ? 'success' : merged === '' ? 'info' : 'primary'
    const txt = typeof merged === 'number'
        ? t(msg => msg.setting.merge.resultOfLevel, { level: merged + 1 })
        : merged === '' ? t(msg => msg.setting.merge.resultOfOrigin) : merged
    const tagProps = {
        class: 'white-item',
        type,
        closable: true,
        onClose: () => handleTagClose(ruleItem)
    }
    return h(ElTag, tagProps, () => `${origin}  >>>  ${txt}`)
}

const inputVal = (modelValue: Ref<string>, placeholder: keyof SettingMessage['merge']) => h(ElInput, {
    class: 'input-new-tag white-item origin-domain-input',
    modelValue: modelValue.value,
    placeholder: t(msg => msg.setting.merge[placeholder]),
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
const buttonMessage = () => inputVisibleRef.value ? t(msg => msg.setting.save) : `+ ${t(msg => msg.setting.newOne)}`

const inputButton = () => h(ElButton, buttonProps, buttonMessage)

const tags = () => {
    const result = []
    const tags = ruleItemsRef.value.map(generateTagItems)
    result.push(...tags)
    // Display the input
    inputVisibleRef.value && result.push(originInputTag(), mergedInputTag())
    // Click this button to display the input then focus it
    result.push(inputButton())
    return result
}

export default tags
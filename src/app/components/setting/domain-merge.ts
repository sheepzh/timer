import { ElAlert, ElButton, ElInput, ElMessage, ElMessageBox, ElTag } from "element-plus"
import { defineComponent, h, Ref, ref } from "vue"
import { t } from "../../locale"
import MergeRuleDatabase from "../../../database/merge-rule-database"
import DomainMergeRuleItem from "../../../entity/dto/domain-merge-rule-item"
import { isValidMergeOriginHost } from "../../../util/pattern"

const mergeRuleDatabase = new MergeRuleDatabase(chrome.storage.local)

const ruleItemsRef: Ref<DomainMergeRuleItem[]> = ref([])

const inputVisibleRef: Ref<boolean> = ref(false)
const originValRef: Ref<string> = ref('')
const mergedValRef: Ref<string> = ref('')

mergeRuleDatabase
    .selectAll()
    .then(items => ruleItemsRef.value = [...items])

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
        if (mergedDotCount < 1) {
            mergedDotCount = 0
        } else {
            mergedDotCount--
        }
        toInsert = { origin, merged: mergedDotCount }
    } else {
        if (!merged) {
            merged === ''
        }
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
const generateTagItems = (ruleItem: DomainMergeRuleItem) => {
    const { origin, merged } = ruleItem
    const type = typeof merged === 'number'
        ? 'success'
        : merged === '' ? 'info' : 'primary'
    const txt = typeof merged === 'number'
        ? t(msg => msg.setting.merge.resultOfLevel, { level: merged + 1 })
        : merged === '' ? t(msg => msg.setting.merge.resultOfOrigin) : merged
    return h(ElTag,
        {
            class: 'white-item',
            type,
            closable: true,
            onClose: () => {
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
        },
        () => `${origin}  >>>  ${txt}`
    )
}

const _default = defineComponent(() => {
    const labels = () => [
        h(ElAlert,
            { type: 'info', title: t(msg => msg.setting.merge.infoAlertTitle) },
            () => [
                h('li', t(msg => msg.setting.merge.infoAlert0)),
                h('li', t(msg => msg.setting.merge.infoAlert1)),
                h('li', t(msg => msg.setting.merge.infoAlert2)),
                h('li', t(msg => msg.setting.merge.infoAlert3)),
                h('li', t(msg => msg.setting.merge.infoAlert4)),
                h('li', t(msg => msg.setting.merge.infoAlert5))
            ]
        )
    ]
    const tags = () => {
        const result = []
        const tags = ruleItemsRef.value.map(generateTagItems)
        result.push(...tags)
        // Display the input
        if (inputVisibleRef.value) {
            const originInput = h(ElInput,
                {
                    class: 'input-new-tag white-item origin-domain-input',
                    modelValue: originValRef.value,
                    placeholder: t(msg => msg.setting.merge.originPlaceholder),
                    clearable: true,
                    onClear: () => originValRef.value = '',
                    onInput: (val: string) => originValRef.value = val.trim(),
                }
            )
            const mergedInput = h(ElInput, {
                class: 'input-new-tag white-item merged-domain-input',
                modelValue: mergedValRef.value,
                placeholder: t(msg => msg.setting.merge.mergedPlaceholder), clearable: true,
                onClear: () => mergedValRef.value = '',
                onInput: (val: string) => mergedValRef.value = val.trim()
            })
            result.push(originInput, mergedInput)
        }
        // Click this button to display the input then focus it
        result.push(
            h(ElButton,
                {
                    size: 'small',
                    class: 'button-new-tag white-item',
                    onClick: () => {
                        if (inputVisibleRef.value) {
                            handleInputConfirm()
                        } else {
                            inputVisibleRef.value = true
                        }
                    }
                },
                () => inputVisibleRef.value ? t(msg => msg.setting.save) : `+ ${t(msg => msg.setting.newOne)}`
            )
        )
        return result
    }
    return () => h('div', [labels(), tags()])
})

export default _default
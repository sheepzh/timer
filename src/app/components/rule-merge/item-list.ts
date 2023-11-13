/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElMessage, ElMessageBox } from "element-plus"
import { Ref, ref, h, VNode } from "vue"
import MergeRuleDatabase from "@db/merge-rule-database"
import { t } from "@app/locale"
import Item, { ItemInstance } from './components/item'
import AddButton, { AddButtonInstance } from './components/add-button'

const mergeRuleDatabase = new MergeRuleDatabase(chrome.storage.local)
const ruleItemsRef: Ref<timer.merge.Rule[]> = ref([])

function queryData() {
    mergeRuleDatabase
        .selectAll()
        .then(items => ruleItemsRef.value = [...items])
}

queryData()

const handleInputConfirm = (origin: string, merged: string | number, addButtonRef: Ref<AddButtonInstance>) => {
    const exists = ruleItemsRef.value.filter(item => item.origin === origin).length > 0
    if (exists) {
        ElMessage.warning(t(msg => msg.mergeRule.duplicateMsg, { origin }))
        return
    }
    let toInsert: timer.merge.Rule
    if (typeof merged === 'number') {
        merged < 1 ? (merged = 0) : (merged--)
    } else {
        !merged && (merged === '')
    }
    toInsert = { origin, merged }

    ElMessageBox.confirm(
        t(msg => msg.mergeRule.addConfirmMsg, { origin }),
        t(msg => msg.operation.confirmTitle), { dangerouslyUseHTMLString: true }
    ).then(async () => {
        await mergeRuleDatabase.add(toInsert)
        queryData()
        ElMessage({ type: 'success', message: t(msg => msg.operation.successMsg) })
        addButtonRef.value.closeEdit()
    }).catch(() => { })
}

// Render the tag items
const handleTagClose = (origin: string) => {
    const confirmMsg = t(msg => msg.mergeRule.removeConfirmMsg, { origin })
    const confirmTitle = t(msg => msg.operation.confirmTitle)
    ElMessageBox
        .confirm(confirmMsg, confirmTitle)
        .then(async () => await mergeRuleDatabase.remove(origin))
        .then(() => {
            ElMessage({ type: 'success', message: t(msg => msg.operation.successMsg) })
            queryData()
        })
        .catch(() => { })
}

async function handleChange(origin: string, merged: string | number, index: number, ref: Ref<ItemInstance>): Promise<void> {
    const hasDuplicate = ruleItemsRef.value.find((o, i) => o.origin === origin && i != index)
    if (hasDuplicate) {
        ElMessage.warning(t(msg => msg.mergeRule.duplicateMsg, { origin }))
        ref.value.forceEdit()
        return
    }
    const beforeItem = ruleItemsRef.value[index]
    await mergeRuleDatabase.remove(beforeItem.origin)
    beforeItem.origin = origin
    beforeItem.merged = merged
    await mergeRuleDatabase.add(beforeItem)
    ElMessage({ type: 'success', message: t(msg => msg.operation.successMsg) })
}

function generateTagItem(ruleItem: timer.merge.Rule, index: number): VNode {
    const { origin, merged } = ruleItem
    const item: Ref<ItemInstance> = ref()
    return h(Item, {
        ref: item,
        index,
        origin,
        merged,
        onDelete: origin => handleTagClose(origin),
        onChange: (origin, merged, index) => handleChange(origin, merged, index, item)
    })
}

const itemList = () => {
    const result = []
    ruleItemsRef.value.forEach((item, index) => {
        result.push(generateTagItem(item, index))
    })
    const addButtonRef: Ref<AddButtonInstance> = ref()
    const addButton = h(AddButton, {
        ref: addButtonRef,
        onSave: (origin, merged) => handleInputConfirm(origin, merged, addButtonRef)
    })
    result.push(addButton)
    return h('div', { class: 'editable-tag-container' }, result)
}

export default itemList
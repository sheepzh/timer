/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElMessage, ElMessageBox } from "element-plus"
import { Ref, ref, h, VNode } from "vue"
import MergeRuleDatabase from "@db/merge-rule-database"
import HostMergeRuleItem from "@entity/dto/host-merge-rule-item"
import { t } from "@app/locale"
import Item from './components/item'
import AddButton from './components/add-button'

const mergeRuleDatabase = new MergeRuleDatabase(chrome.storage.local)
const ruleItemsRef: Ref<HostMergeRuleItem[]> = ref([])

function queryData() {
    mergeRuleDatabase
        .selectAll()
        .then(items => ruleItemsRef.value = [...items])
}

queryData()

const handleInputConfirm = (origin: string, merged: string | number, addButtonRef: Ref) => {
    const exists = ruleItemsRef.value.filter(item => item.origin === origin).length > 0
    if (exists) {
        ElMessage.warning(t(msg => msg.mergeRule.duplicateMsg, { origin }))
        return
    }
    let toInsert: HostMergeRuleItem
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

async function handleChange(origin: string, merged: string | number, index: number, ref: Ref): Promise<void> {
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

function generateTagItem(ruleItem: HostMergeRuleItem, index: number): VNode {
    const { origin, merged } = ruleItem
    const itemRef: Ref = ref()
    return h(Item, {
        ref: itemRef,
        index,
        origin,
        merged,
        onDeleted: origin => handleTagClose(origin),
        onChanged: (origin, merged, index) => handleChange(origin, merged, index, itemRef)
    })
}

const itemList = () => {
    const result = []
    ruleItemsRef.value.forEach((item, index) => {
        result.push(generateTagItem(item, index))
    })
    const addButtonRef: Ref = ref()
    const addButton = h(AddButton, {
        ref: addButtonRef,
        onSaved: (origin, merged) => handleInputConfirm(origin, merged, addButtonRef)
    })
    result.push(addButton)
    return result
}

export default itemList
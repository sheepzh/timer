/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import MergeRuleDatabase from "@db/merge-rule-database"
import { useRequest } from "@hooks/useRequest"
import { ElMessage, ElMessageBox } from "element-plus"
import { defineComponent, Ref, ref } from "vue"
import AddButton, { AddButtonInstance } from './components/AddButton'
import Item, { ItemInstance } from './components/Item'

const mergeRuleDatabase = new MergeRuleDatabase(chrome.storage.local)

const _default = defineComponent(() => {
    const { data: items, refresh } = useRequest(() => mergeRuleDatabase.selectAll())
    const handleSucc = () => {
        ElMessage.success(t(msg => msg.operation.successMsg))
        refresh()
    }
    const { refreshAsync: remove } = useRequest(
        (origin: string) => mergeRuleDatabase.remove(origin),
        { onSuccess: handleSucc, manual: true },
    )
    const { refresh: update } = useRequest(async (origin: string, merged: string | number) => {
        await mergeRuleDatabase.remove(origin)
        await mergeRuleDatabase.add({ origin, merged })
    }, { onSuccess: handleSucc, manual: true })

    const itemRefs = ref<ItemInstance[]>([])

    const handleDelete = (origin: string) => {
        const message = t(msg => msg.mergeRule.removeConfirmMsg, { origin })
        const title = t(msg => msg.operation.confirmTitle)
        ElMessageBox.confirm(message, title).then(() => remove(origin))
    }

    async function handleChange(origin: string, merged: string | number, index: number): Promise<void> {
        const hasDuplicate = items.value?.find((o, i) => o.origin === origin && i !== index)
        if (hasDuplicate) {
            ElMessage.warning(t(msg => msg.mergeRule.duplicateMsg, { origin }))
            itemRefs.value?.[index]?.forceEdit?.()
            return
        }
        update(origin, merged)
    }

    const addButton: Ref<AddButtonInstance> = ref()

    const { refresh: add } = useRequest((rule: timer.merge.Rule) => mergeRuleDatabase.add(rule), {
        onSuccess: () => {
            handleSucc()
            addButton.value?.closeEdit?.()
        },
        manual: true,
    })

    const handleAdd = (origin: string, merged: string | number) => {
        const alreadyExist = items.value?.filter(item => item.origin === origin).length > 0
        if (alreadyExist) {
            ElMessage.warning(t(msg => msg.mergeRule.duplicateMsg, { origin }))
            return
        }

        const title = t(msg => msg.operation.confirmTitle)
        const content = t(msg => msg.mergeRule.addConfirmMsg, { origin })
        ElMessageBox.confirm(content, title, { dangerouslyUseHTMLString: true })
            .then(() => add({ origin, merged }))
    }

    return () => (
        <div class='editable-tag-container'>
            {items.value?.map((item, idx) =>
                <Item
                    ref={() => itemRefs.value[idx]}
                    origin={item.origin}
                    merged={item.merged}
                    onDelete={handleDelete}
                    onChange={(origin, merged) => handleChange(origin, merged, idx)}
                />
            )}
            <AddButton ref={addButton} onSave={handleAdd} />
        </div>
    )
})

export default _default
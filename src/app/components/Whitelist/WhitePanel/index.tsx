/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { Ref } from "vue"

import { ElMessage, ElMessageBox } from "element-plus"
import { t } from "@app/locale"
import { defineComponent, ref } from "vue"
import whitelistService from "@service/whitelist-service"
import WhiteItem, { ItemInstance } from './WhiteItem'
import AddButton, { AddButtonInstance } from './AddButton'

const _default = defineComponent({
    setup: () => {
        const whitelist: Ref<string[]> = ref([])
        const itemRefs: Ref<ItemInstance>[] = []
        const addButtonRef: Ref<AddButtonInstance> = ref()
        const queryData = () => whitelistService.listAll().then(list => whitelist.value = list || [])

        queryData()

        const handleChanged = async (val: string, index: number) => {
            const ref = itemRefs[index]
            const duplicate = whitelist.value?.find?.((white, i) => white === val && i !== index)
            if (duplicate) {
                ElMessage({ type: 'warning', message: t(msg => msg.whitelist.duplicateMsg) })
                // Reopen
                ref.value.forceEdit()
                return
            }
            await whitelistService.remove(whitelist.value[index])
            await whitelistService.add(val)
            whitelist.value[index] = val
            ElMessage({ type: 'success', message: t(msg => msg.operation.successMsg) })
        }

        const handleAdd = (val: string) => {
            const exists = whitelist.value?.some(item => item === val)
            if (exists) return ElMessage.warning(t(msg => msg.whitelist.duplicateMsg))

            const msg = t(msg => msg.whitelist.addConfirmMsg, { url: val })
            const title = t(msg => msg.operation.confirmTitle)
            ElMessageBox.confirm(msg, title, { dangerouslyUseHTMLString: true })
                .then(async () => {
                    await whitelistService.add(val)
                    whitelist.value?.push(val)
                    ElMessage({ type: 'success', message: t(msg => msg.operation.successMsg) })
                    addButtonRef.value?.closeEdit?.()
                }).catch(() => { })
        }

        const handleClose = (whiteItem: string) => {
            const confirmMsg = t(msg => msg.whitelist.removeConfirmMsg, { url: whiteItem })
            const confirmTitle = t(msg => msg.operation.confirmTitle)
            ElMessageBox
                .confirm(confirmMsg, confirmTitle, { dangerouslyUseHTMLString: true })
                .then(() => whitelistService.remove(whiteItem))
                .then(() => {
                    ElMessage({ type: 'success', message: t(msg => msg.operation.successMsg) })
                    const index = whitelist.value.indexOf(whiteItem)
                    index !== -1 && whitelist.value.splice(index, 1)
                })
                .catch(() => { })
        }

        return () => (
            <div class="editable-tag-container">
                {
                    whitelist.value?.map((white, index) => <WhiteItem
                        white={white}
                        index={index}
                        ref={itemRefs?.[index]}
                        onChange={handleChanged}
                        onDelete={val => handleClose(val)}
                    />)
                }
                <AddButton ref={addButtonRef} onSave={handleAdd} />
            </div>
        )
    }
})

export default _default
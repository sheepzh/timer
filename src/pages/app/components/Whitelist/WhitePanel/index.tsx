/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { t } from "@app/locale"
import { useRequest } from "@hooks"
import whitelistService from "@service/whitelist-service"
import { ElMessage, ElMessageBox } from "element-plus"
import { defineComponent, ref } from "vue"
import AddButton, { type AddButtonInstance } from './AddButton'
import WhiteItem from './WhiteItem'

const _default = defineComponent(() => {
    const { data: whitelist } = useRequest(() => whitelistService.listAll(), { defaultValue: [] })
    const addButton = ref<AddButtonInstance>()

    const handleChanged = async (val: string, index: number, editAgain: () => void) => {
        const duplicate = whitelist.value?.find?.((white, i) => white === val && i !== index)
        if (duplicate) {
            ElMessage.warning(t(msg => msg.whitelist.duplicateMsg))
            // Reopen
            return editAgain?.()
        }
        await whitelistService.remove(whitelist.value[index])
        await whitelistService.add(val)
        whitelist.value[index] = val
        ElMessage.success(t(msg => msg.operation.successMsg))
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
                ElMessage.success(t(msg => msg.operation.successMsg))
                addButton.value?.closeEdit?.()
            }).catch(() => { })
    }

    const handleClose = (whiteItem: string) => {
        const confirmMsg = t(msg => msg.whitelist.removeConfirmMsg, { url: whiteItem })
        const confirmTitle = t(msg => msg.operation.confirmTitle)
        ElMessageBox
            .confirm(confirmMsg, confirmTitle, { dangerouslyUseHTMLString: true })
            .then(() => whitelistService.remove(whiteItem))
            .then(() => {
                ElMessage.success(t(msg => msg.operation.successMsg))
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
                    onChange={(val, editAgain) => handleChanged(val, index, editAgain)}
                    onDelete={val => handleClose(val)}
                />)
            }
            <AddButton ref={addButton} onSave={handleAdd} />
        </div>
    )
})

export default _default
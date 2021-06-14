import { ElAlert, ElButton, ElInput, ElMessage, ElMessageBox, ElTag } from "element-plus"
import { defineComponent, h, ref, Ref } from "vue"
import { t } from "../../locale"
import whitelistService from "../../../service/whitelist-service"

const whitelistRef: Ref<string[]> = ref([])
whitelistService
    .listAll()
    .then(list => whitelistRef.value = list)
const inputVisibleRef: Ref<boolean> = ref(false)
const inputValRef: Ref<string> = ref('')

const handleInputConfirm = () => {
    const inputValue = inputValRef.value
    const whitelist = whitelistRef.value
    if (inputValue) {
        if (whitelist.includes(inputValue)) {
            ElMessage({ type: 'warning', message: t(msg => msg.setting.whitelist.duplicateMsg) })
        } else {
            ElMessageBox.confirm(
                t(msg => msg.setting.whitelist.addConfirmMsg, { url: inputValue }),
                t(msg => msg.setting.confirmTitle), { dangerouslyUseHTMLString: true }
            ).then(() => whitelistService.add(inputValue)
            ).then(() => {
                whitelist.push(inputValue)
                ElMessage({ type: 'success', message: t(msg => msg.setting.successMsg) })
            }).catch(() => { })
        }
    }
    // Clear input anyway
    inputVisibleRef.value = false
    inputValRef.value = ''
}

// Render the tag items of whitelist 
const generateTagItems = (whiteItem: string) => h(ElTag,
    {
        class: 'white-item',
        type: 'primary',
        closable: true,
        onClose: () => {
            const confirmMsg = t(msg => msg.setting.whitelist.removeConfirmMsg, { url: whiteItem })
            const confirmTitle = t(msg => msg.setting.confirmTitle)
            ElMessageBox
                .confirm(confirmMsg, confirmTitle, { dangerouslyUseHTMLString: true })
                .then(() => whitelistService.remove(whiteItem))
                .then(() => {
                    ElMessage({ type: 'success', message: t(msg => msg.setting.successMsg) })
                    const index = whitelistRef.value.indexOf(whiteItem)
                    index !== -1 && whitelistRef.value.splice(index, 1)
                })
                .catch(() => { })
        }
    },
    () => whiteItem
)

const _default = defineComponent(() => {
    const alertInfo = () => h(ElAlert, { type: 'success', title: t(msg => msg.setting.whitelist.infoAlert) })
    const tags = () => {
        const result = []
        result.push(...whitelistRef.value.map(generateTagItems))
        // Display the input
        inputVisibleRef.value && result.push(
            h(ElInput,
                {
                    class: 'input-new-tag white-item',
                    modelValue: inputValRef.value,
                    clearable: true,
                    onClear: () => inputValRef.value = '',
                    onInput: (val: string) => inputValRef.value = val.trim(),
                    onKeyup: (event: KeyboardEvent) => event.key === 'Enter' && handleInputConfirm(),
                    onBlur: () => handleInputConfirm()
                }
            )
        )
        // Click this button to display the input then focus it
        inputVisibleRef.value || result.push(
            h(ElButton,
                {
                    size: 'small',
                    class: 'button-new-tag white-item',
                    onClick: () => inputVisibleRef.value = true
                },
                () => `+ ${t(msg => msg.setting.newOne)}`
            )
        )
        return result
    }
    return () => h('div', [alertInfo(), tags()])
})

export default _default
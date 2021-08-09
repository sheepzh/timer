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

const handleInputSave = (inputValue: string) => {
    const whitelist = whitelistRef.value
    if (whitelist.includes(inputValue)) {
        ElMessage({ type: 'warning', message: t(msg => msg.additional.whitelist.duplicateMsg) })
        return
    }
    const msg = t(msg => msg.additional.whitelist.addConfirmMsg, { url: inputValue })
    const title = t(msg => msg.additional.confirmTitle)
    ElMessageBox.confirm(msg, title, { dangerouslyUseHTMLString: true })
        .then(() => whitelistService.add(inputValue))
        .then(() => {
            whitelist.push(inputValue)
            ElMessage({ type: 'success', message: t(msg => msg.additional.successMsg) })
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
    const confirmMsg = t(msg => msg.additional.whitelist.removeConfirmMsg, { url: whiteItem })
    const confirmTitle = t(msg => msg.additional.confirmTitle)
    ElMessageBox
        .confirm(confirmMsg, confirmTitle, { dangerouslyUseHTMLString: true })
        .then(() => whitelistService.remove(whiteItem))
        .then(() => {
            ElMessage({ type: 'success', message: t(msg => msg.additional.successMsg) })
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

const alertInfo = () => h(ElAlert, { type: 'success', title: t(msg => msg.additional.whitelist.infoAlert) })

const whiteItemInput = () => h(ElInput,
    {
        class: 'input-new-tag white-item',
        modelValue: inputValRef.value,
        clearable: true,
        placeholder: t(msg => msg.additional.whitelist.placeholder),
        onClear: () => inputValRef.value = '',
        onInput: (val: string) => inputValRef.value = val.trim(),
        onKeyup: (event: KeyboardEvent) => event.key === 'Enter' && handleInputConfirm(),
        onBlur: () => handleInputConfirm()
    }
)

const whiteItemDisplayButton = () => h(ElButton,
    {
        size: 'small',
        class: 'button-new-tag white-item',
        onClick: () => inputVisibleRef.value = true
    },
    () => `+ ${t(msg => msg.additional.newOne)}`
)
const tags = () => {
    const result = []
    result.push(...whitelistRef.value.map(generateTagItems))
    result.push(inputVisibleRef.value ? whiteItemInput() : whiteItemDisplayButton())
    return result
}

const _default = defineComponent(() => () => h('div', [alertInfo(), tags()]))

export default _default
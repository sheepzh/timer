import { ElAlert, ElButton, ElInput, ElMessage, ElMessageBox, ElTag } from "element-plus"
import { defineComponent, h, ref, Ref } from "vue"
import { t } from "../../../common/vue-i18n"
import whitelistService from "../../../service/whitelist-service"
import { FAVICON } from "../../../util/constant/url"
import './style/whitelist'

const whitelistRef: Ref<string[]> = ref([])
whitelistService.listAll(list => whitelistRef.value = list)
const inputVisibleRef: Ref<boolean> = ref(false)
const inputValRef: Ref<string> = ref('')

const handleInputConfirm = () => {
    const inputValue = inputValRef.value
    const whitelist = whitelistRef.value
    if (inputValue) {
        if (whitelist.includes(inputValue)) {
            ElMessage({ type: 'warning', message: t('setting.whitelist.duplicateMsg') })
        } else {
            ElMessageBox.confirm(
                t('setting.whitelist.addConfirmMsg', { url: `${inputValue}<img src="${FAVICON(inputValue)}" width="15px" height="15px">` }),
                t('setting.whitelist.confirmTitle'), { dangerouslyUseHTMLString: true }
            ).then(r => {
                whitelistService.add(inputValue, () => {
                    whitelist.push(inputValue)
                    ElMessage({ type: 'success', message: t('setting.whitelist.successMsg') })
                })
            }).catch(() => { })
        }
    }
    // Clear input anyway
    inputVisibleRef.value = false
    inputValRef.value = ''
}

const _default = defineComponent(() => {
    const alertInfo = () => h(ElAlert, { type: 'success', title: t('setting.whitelist.infoAlert'), style: 'margin-bottom: 20px;' })
    const tags = () => {
        const result = []
        whitelistRef.value
            .map(white =>
                h(ElTag,
                    {
                        class: 'white-item',
                        type: 'primary',
                        closable: true,
                        onClose: () => {
                            ElMessageBox.confirm(
                                t('setting.whitelist.removeConfirmMsg', { url: `${white}<img src="${FAVICON(white)}" width="15px" height="15px">` }),
                                t('setting.whitelist.confirmTitle'),
                                { dangerouslyUseHTMLString: true }
                            ).then(() => {
                                whitelistService.remove(white, () => {
                                    ElMessage({ type: 'success', message: t('setting.whitelist.successMsg') })
                                    const index = whitelistRef.value.indexOf(white)
                                    index !== -1 && whitelistRef.value.splice(index, 1)
                                })
                            }).catch(() => { })
                        }
                    },
                    () => white
                )
            ).forEach(tag => result.push(tag))
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
                () => `+ ${t('setting.whitelist.newOne')}`
            )
        )
        return result
    }
    return () => h('div', [alertInfo(), tags()])
})

export default _default
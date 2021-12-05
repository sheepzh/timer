/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElButton, ElInput, ElMessage, ElMessageBox, ElTag } from "element-plus"
import { SiteManageMessage } from "../../../app/locale/components/site-manage"
import { Ref, ref, h } from "vue"
import HostAliasDatabase from "../../../database/host-alias-database"
import HostAlias, { HostAliasSource } from "../../../entity/dto/host-alias"
import { isValidHost } from "../../../util/pattern"
import { t } from "../../locale"

const hostAliasDatabase = new HostAliasDatabase(chrome.storage.local)
const hostAliasesRef: Ref<HostAlias[]> = ref([])
hostAliasDatabase.selectAll().then(items => hostAliasesRef.value = [...items])

const inputVisibleRef: Ref<boolean> = ref(false)
const hostRef: Ref<string> = ref('')
const aliasRef: Ref<string> = ref('')

const handleInputConfirm = () => {
    const host = hostRef.value
    const alias = aliasRef.value

    if (!isValidHost(host)) {
        ElMessage.warning(t(msg => msg.siteManage.errorHost))
        return
    }
    const exists = hostAliasesRef.value.filter(item => item.host === host).length > 0
    if (exists) {
        ElMessage.warning(t(msg => msg.siteManage.duplicateMsg, { host }))
        return
    }
    let toInsert: HostAlias = { host, name: alias, source: HostAliasSource.USER }

    ElMessageBox.confirm(
        t(msg => msg.siteManage.addConfirmMsg, { host }),
        t(msg => msg.operation.confirmTitle), { dangerouslyUseHTMLString: true }
    ).then(() => hostAliasDatabase.update(toInsert)
    ).then(() => {
        hostAliasesRef.value.push(toInsert)
        ElMessage({ type: 'success', message: t(msg => msg.operation.successMsg) })
    }).catch(() => { })

    inputVisibleRef.value = false
    hostRef.value = ''
    aliasRef.value = ''
}

// Render the tag items
const handleTagClose = (hostAlias: HostAlias) => {
    const { host } = hostAlias
    const confirmMsg = t(msg => msg.siteManage.removeConfirmMsg, { host })
    const confirmTitle = t(msg => msg.operation.confirmTitle)
    ElMessageBox
        .confirm(confirmMsg, confirmTitle)
        .then(() => hostAliasDatabase.remove(host))
        .then(() => {
            ElMessage({ type: 'success', message: t(msg => msg.operation.successMsg) })
            const index = hostAliasesRef.value.indexOf(hostAlias)
            index !== -1 && hostAliasesRef.value.splice(index, 1)
        })
        .catch(() => { })
}

const generateTagItems = (hostAlias: HostAlias) => {
    const { host, name, source } = hostAlias
    const type: '' | 'info' | 'success' = source === HostAliasSource.USER ? 'success' : 'info'
    const txt = `${host}  >>>  ${name}`
    const tagProps = {
        class: 'white-item',
        type,
        closable: true,
        onClose: () => handleTagClose(hostAlias)
    }
    return h(ElTag, tagProps, () => txt)
}

const inputVal = (modelValue: Ref<string>, placeholder: keyof SiteManageMessage) => h(ElInput, {
    class: 'input-new-tag white-item origin-host-input',
    modelValue: modelValue.value,
    placeholder: t(msg => msg.siteManage[placeholder]),
    clearable: true,
    onClear: () => modelValue.value = '',
    onInput: (val: string) => modelValue.value = val.trim(),
})

const hostInputTag = () => inputVal(hostRef, 'hostPlaceholder')

const aliasInputTag = () => inputVal(aliasRef, 'aliasPlaceholder')

const buttonProps = {
    size: 'small',
    class: 'button-new-tag white-item',
    onClick: () => inputVisibleRef.value ? handleInputConfirm() : (inputVisibleRef.value = true)
}
const buttonMessage = () => inputVisibleRef.value ? t(msg => msg.operation.save) : `+ ${t(msg => msg.operation.newOne)}`

const inputButton = () => h<{}>(ElButton, buttonProps, buttonMessage)

const itemList = () => {
    const result = []
    const tags = hostAliasesRef.value.map(generateTagItems)
    result.push(...tags)
    // Display the input
    inputVisibleRef.value && result.push(hostInputTag(), aliasInputTag())
    // Click this button to display the input then focus it
    result.push(inputButton())
    return result
}

export default itemList
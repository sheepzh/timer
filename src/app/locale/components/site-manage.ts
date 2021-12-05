/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Messages } from "../../../util/i18n"

export type SiteManageMessage = {
    infoAlertTitle: string
    infoAlert0: string
    infoAlert1: string
    infoAlert2: string
    infoAlert3: string
    errorHost: string
    removeConfirmMsg: string
    duplicateMsg: string
    addConfirmMsg: string
    hostPlaceholder: string
    aliasPlaceholder: string
}

const en: SiteManageMessage = {
    infoAlertTitle: "You can set the website name here",
    infoAlert0: "",
    infoAlert1: "You can set whether to display the website name in the [Today Data] in the [Extension Options]",
    infoAlert2: "If you enable the automatic collection function in the [Extension Options], "
        + "the extension will also help you automatically collect the website name, "
        + "but it will not overwrite the content you manually fill in",
    infoAlert3: "The green label is what you fill in manually, "
        + "and the gray one is automatically collected",
    errorHost: "Invalid host format",
    removeConfirmMsg: "The name setting of the site {host} will be removed",
    duplicateMsg: "Exists. please delete it at first",
    addConfirmMsg: "The name will be set for {host}",
    hostPlaceholder: "Host",
    aliasPlaceholder: "Name"
}

const messages: Messages<SiteManageMessage> = {
    zh_CN: {
        infoAlertTitle: "你可以在这里维护网站名称",
        infoAlert0: "点击新增按钮，会弹出域名和名称的输入框，填写并保存即可",
        infoAlert1: "自定义的网站名称更方便您查看数据。您可以在【扩展选项】中设置是否要在【今日数据】里显示网站名称",
        infoAlert2: "如果您在【扩展选项】中开启自动收集功能，扩展也会自动帮您收集网站名称，但不会覆盖您手动填写的内容",
        infoAlert3: "绿色标签是您手动填写的内容，灰色则是扩展自动收集的",
        errorHost: "域名格式错误",
        removeConfirmMsg: "网站 {host} 的名称设置将被移除",
        duplicateMsg: "网站名称已存在，请先删除",
        addConfirmMsg: "将为 {host} 设置名称",
        hostPlaceholder: "域名",
        aliasPlaceholder: "名称"
    },
    en,
    // Feedback
    ja: en
}

export default messages

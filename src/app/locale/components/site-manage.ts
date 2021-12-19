/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Messages } from "../../../util/i18n"

export type SiteManageMessage = {
    hostPlaceholder: string
    aliasPlaceholder: string
    onlyDetected: string
    deleteConfirmMsg: string
    column: {
        host: string
        alias: string
        aliasInfo: string
        source: string
    }
    source: {
        user: string
        detected: string
    }
    button: {
        add: string
        delete: string
        modify: string
        save: string
    }
    form: {
        emptyAlias: string
        emptyHost: string
    }
    msg: {
        hostExistWarn: string
        saved: string
        existedTag: string
    }
}

const en: SiteManageMessage = {
    hostPlaceholder: "Search by host",
    aliasPlaceholder: "Search by name",
    onlyDetected: 'Only Detected',
    deleteConfirmMsg: 'The name of {host} will be deleted',
    column: {
        host: "Host",
        alias: "Site Name",
        aliasInfo: "The site name will be shown on the report page and the popup page",
        source: "Source"
    },
    source: {
        user: 'USER',
        detected: 'DETECTED'
    },
    button: {
        add: 'New',
        delete: 'Delete',
        modify: 'Modify',
        save: 'Save',
    },
    form: {
        emptyAlias: 'Please input the site name',
        emptyHost: 'Please input the host'
    },
    msg: {
        hostExistWarn: '{host} exists',
        saved: 'Saved',
        existedTag: 'EXISTED'
    }
}

const messages: Messages<SiteManageMessage> = {
    zh_CN: {
        hostPlaceholder: "请输入域名，然后回车",
        aliasPlaceholder: "请输入网站名，然后回车",
        onlyDetected: '只看自动抓取',
        deleteConfirmMsg: '{host} 的名称设置将会被删除',
        column: {
            host: "网站域名",
            alias: "网站名称",
            aliasInfo: "网站名称会在报表以及今日数据（需要在扩展选项里设置）里展示，方便您快速识别域名",
            source: "来源"
        },
        source: {
            user: '手动设置',
            detected: '自动抓取'
        },
        button: {
            add: '新增',
            delete: '删除',
            modify: '修改',
            save: '保存'
        },
        form: {
            emptyAlias: '请输入网站名称',
            emptyHost: '请输入网站域名'
        },
        msg: {
            hostExistWarn: '{host} 已经存在',
            saved: '已保存',
            existedTag: '已存在'
        }
    },
    en,
    // Feedback
    ja: en
}

export default messages

/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Messages } from "@util/i18n"

export type OperationMessage = {
    confirmTitle: string
    successMsg: string
    save: string
    newOne: string
}

const messages: Messages<OperationMessage> = {
    zh_CN: {
        confirmTitle: '操作确认',
        successMsg: '操作成功！',
        newOne: '新增',
        save: '保存'
    },
    en: {
        confirmTitle: 'Confirm',
        successMsg: 'Successfully!',
        newOne: 'New One',
        save: 'Save'
    },
    ja: {
        confirmTitle: '動作確認',
        successMsg: '正常に動作しました！',
        newOne: '追加',
        save: '保存'
    }
}

export default messages
/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

export type ConfirmMessage = {
    confirmMsg: string,
    cancelMsg: string
}

const _default: Messages<ConfirmMessage> = {
    zh_CN: {
        confirmMsg: '好的',
        cancelMsg: '不用了',
    },
    zh_TW: {
        confirmMsg: '好的',
        cancelMsg: '不用了',
    },
    en: {
        confirmMsg: 'OK',
        cancelMsg: 'NO!',
    },
    ja: {
        confirmMsg: 'OK',
        cancelMsg: 'キャンセル',
    },
}

export default _default
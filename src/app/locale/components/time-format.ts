/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Messages } from "@util/i18n"

export type TimeFormatMessage = { [key in timer.app.TimeFormat]: string }

const _default: Messages<TimeFormatMessage> = {
    zh_CN: {
        default: '默认时间格式',
        hour: '按小时显示',
        minute: '按分钟显示',
        second: '按秒显示'
    },
    zh_TW: {
        default: '默認時間格式',
        hour: '按小時顯示',
        minute: '按分鐘顯示',
        second: '按秒顯示'
    },
    en: {
        default: 'Default time format',
        hour: 'Display in hours',
        minute: 'Display in minutes',
        second: 'Display in seconds'
    },
    ja: {
        default: 'デフォルトの時間形式',
        hour: '時間単位で表示',
        minute: '分単位で表示',
        second: '秒単位で表示'
    }
}

export default _default
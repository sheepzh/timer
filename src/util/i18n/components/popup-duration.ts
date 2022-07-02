/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Messages } from ".."

export type PopupDurationMessage = { [key in timer.PopupDuration]: string }

const _default: Messages<PopupDurationMessage> = {
    zh_CN: {
        today: "今日",
        thisWeek: "本周",
        thisMonth: "本月"
    },
    zh_TW: {
        today: "今日",
        thisWeek: "本週",
        thisMonth: "本月"
    },
    en: {
        today: "Today's",
        thisWeek: "This Week's",
        thisMonth: "This Month's"
    },
    ja: {
        today: "今日の",
        thisWeek: "今週の",
        thisMonth: "今月の"
    }
}

export default _default
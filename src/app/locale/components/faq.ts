/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Messages } from "@util/i18n"


export type FaqMessage = {
    usage: {
        q: string
        a: string
    }
}

const _default: Messages<FaqMessage> = {
    zh_CN: {
        usage: {
            q: 'Test question',
            a: ''
        }
    },
    zh_TW: {
        usage: {
            q: '',
            a: ''
        }
    },
    en: {
        usage: {
            q: '',
            a: ''
        }
    },
    ja: {
        usage: {
            q: '',
            a: ''
        }
    }
}

export default _default
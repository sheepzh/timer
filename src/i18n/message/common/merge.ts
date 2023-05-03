/**
 * Copyright (c) 2023-present Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

export type MergeCommonMessage = {
    tagResult: {
        blank: string
        level: string
    }
}

const messages: Messages<MergeCommonMessage> = {
    en: {
        tagResult: {
            blank: 'Not Merge',
            level: 'Keep Level {level}',
        }
    },
    zh_CN: {
        tagResult: {
            blank: '不合并',
            level: '{level} 级域名',
        },
    },
    zh_TW: {
        tagResult: {
            blank: '不合並',
            level: '{level} 級網域',
        }
    },
    ja: {
        tagResult: {
            blank: '不合并',
            level: '{level} 次ドメイン',
        }
    }
}

export default messages
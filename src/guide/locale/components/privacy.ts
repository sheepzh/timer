/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */


import { Messages } from "@util/i18n"

type _StoreKey =
    | 'p1'
    | 'p2'
    | 'p3'

type _ScopeKey =
    | 'p1'
    | 'l1'
    | 'l2'
    | 'l3'

export type PrivacyMessage = {
    scope: { [key in _ScopeKey]: string }
    storage: { [key in _StoreKey]: string }
}

const _default: Messages<PrivacyMessage> = {
    zh_CN: {
        scope: {
            p1: "为了向您提供完整的服务，该扩展在使用过程中会收集您以下的个人信息：",
            l1: "1. 您浏览网站的时间，以及访问每个网站的次数。",
            l2: "2. 网站的标题以及图标 URL。",
            l3: "3. 为了提高用户体验，扩展在必要时会征得您的授权之后，读取您的剪切板内容。",
        },
        storage: {
            p1: "我们保证该扩展收集的所有数据只会保存在您的浏览器本地存储中，绝不会将他们分发到其他地方。",
            p2: "不过您可以使用扩展提供的工具，以 JSON 或者 CSV 的文件格式，导出或者导入您的数据。扩展也支持您使用 GitHub Gist 等，您足以信任的第三方服务，备份您的数据。",
            p3: "我们只帮助您收集数据，但处置权一定在您。",
        }
    },
    zh_TW: {
        scope: {
            p1: '為了向您提供完整的服務，該擴展在使用過程中會收集您以下的個人信息：',
            l1: '1. 您瀏覽網站的時間，以及訪問每個網站的次數。',
            l2: '2. 網站的標題以及圖標 URL。',
            l3: '3. 為了提高用戶體驗，擴展在必要時會徵得您的授權之後，讀取您的剪切板內容。'
        },
        storage: {
            p1: '我們保證該擴展收集的所有數據只會保存在您的瀏覽器本地存儲中，絕不會將他們分發到其他地方。',
            p2: '不過您可以使用擴展提供的工具，以 JSON 或者 CSV 的文件格式，導出或者導入您的數據。擴展也支持您使用 GitHub Gist 等，您足以信任的第三方服務，備份您的數據。',
            p3: '我們只幫助您收集數據，但處置權一定在您。'
        }
    },
    en: {
        scope: {
            p1: 'In order to provide you with complete services, this extension will collect your following personal information during use:',
            l1: '1. How long you browse the site, and how many times you visit each site.',
            l2: '2. The title of the website and the URL of the icon.',
            l3: '3. In order to improve user experience, the extension will read your clipboard content after obtaining your authorization when necessary.'
        },
        storage: {
            p1: 'We guarantee that all data collected by this extension will only be saved in your browser\'s local storage and will never be distributed elsewhere.',
            p2: 'You can however use the tools provided by the extension to export or import your data in JSON or CSV file format. \
                The extension also supports you to use GitHub Gist, etc., third-party services you trust enough to back up your data.',
            p3: 'We only help you collect data, but the right of disposal must be yours.',
        }
    },
    ja: {
        scope: {
            p1: '完全なサービスを提供するために、この拡張機能は使用中に次の個人情報を収集します。',
            l1: '1. サイトを閲覧した時間と、各サイトにアクセスした回数。',
            l2: '2. ウェブサイトのタイトルとアイコンの URL。',
            l3: '3. ユーザー エクスペリエンスを向上させるために、拡張機能は必要に応じて承認を得た後、クリップボードの内容を読み取ります。',
        },
        storage: {
            p1: 'この拡張機能によって収集されたすべてのデータは、ブラウザのローカル ストレージにのみ保存され、他の場所に配布されることはありません。',
            p2: 'ただし、拡張機能によって提供されるツールを使用して、データを JSON または CSV ファイル形式でエクスポートまたはインポートできます。 \
                この拡張機能は、GitHub Gist など、データをバックアップするのに十分信頼できるサードパーティ サービスの使用もサポートします。',
            p3: '私たちはあなたがデータを収集するのを手伝うだけですが、処分する権利はあなたのものでなければなりません.',
        }
    }
}

export default _default
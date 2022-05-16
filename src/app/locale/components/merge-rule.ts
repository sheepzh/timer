/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Messages } from "@util/i18n"
export type MergeRuleMessage = {
    resultOfOrigin: string
    resultOfLevel: string
    removeConfirmMsg: string
    originPlaceholder: string
    mergedPlaceholder: string
    errorOrigin: string
    duplicateMsg: string
    addConfirmMsg: string
    infoAlertTitle: string
    infoAlert0: string
    infoAlert1: string
    infoAlert2: string
    infoAlert3: string
    infoAlert4: string
    infoAlert5: string
}

const _default: Messages<MergeRuleMessage> = {
    zh_CN: {
        resultOfOrigin: '不合并',
        resultOfLevel: '{level} 级域名',
        removeConfirmMsg: '自定义合并规则 {origin} 将被移除',
        originPlaceholder: '原域名',
        mergedPlaceholder: '合并后域名',
        errorOrigin: '原域名格式错误',
        duplicateMsg: '合并规则已存在：{origin}',
        addConfirmMsg: '将为 {origin} 设置自定义合并规则',
        infoAlertTitle: '该页面可以配置子域名的合并规则',
        infoAlert0: '点击新增按钮，会弹出原域名和合并后域名的输入框，填写并保存规则',
        infoAlert1: '原域名可填具体的域名或者正则表达式，比如 www.baidu.com，*.baidu.com，*.google.com.*。以此确定哪些域名在合并时会使用该条规则',
        infoAlert2: '合并后域名可填具体的域名，或者填数字，或者不填',
        infoAlert3: '如果填数字，则表示合并后域名的级数。比如存在规则【 *.*.edu.cn >>> 3 】，那么 www.hust.edu.cn 将被合并至 hust.edu.cn',
        infoAlert4: '如果不填，则表示原域名不会被合并',
        infoAlert5: '如果没有匹配任何规则，则默认会合并至 {psl} 的前一级'
    },
    zh_TW: {
        resultOfOrigin: '不合並',
        resultOfLevel: '{level} 級網域',
        removeConfirmMsg: '自定義合並規則 {origin} 將被移除',
        originPlaceholder: '原網域',
        mergedPlaceholder: '合並後網域',
        errorOrigin: '原網域格式錯誤',
        duplicateMsg: '合並規則已存在：{origin}',
        addConfirmMsg: '將爲 {origin} 設置自定義合並規則',
        infoAlertTitle: '該頁麵可以配置子網域的合並規則',
        infoAlert0: '點擊新增按鈕，會彈出原網域和合並後網域的輸入框，填冩並保存規則',
        infoAlert1: '原網域可填具體的網域或者正則表達式，比如 www.baidu.com，*.baidu.com，*.google.com.*。以此確定哪些網域在合並時會使用該條規則',
        infoAlert2: '合並後網域可填具體的網域，或者填數字，或者不填',
        infoAlert3: '如果填數字，則表示合並後網域的級數。比如存在規則【 *.*.edu.cn >>> 3 】，那麼 www.hust.edu.cn 將被合並至 hust.edu.cn',
        infoAlert4: '如果不填，則表示原網域不會被合並',
        infoAlert5: '如果沒有匹配任何規則，則默認會合並至 {psl} 的前一級',
    },
    en: {
        resultOfOrigin: 'Not Merge',
        resultOfLevel: 'Keep Level {level}',
        removeConfirmMsg: '{origin} will be removed from customized merge rules.',
        originPlaceholder: 'Origin site',
        mergedPlaceholder: 'Merged',
        errorOrigin: 'The format of origin site is invalid.',
        duplicateMsg: 'The rule already exists: {origin}',
        addConfirmMsg: 'Customized merge rules will be set for {origin}',
        infoAlertTitle: 'This page can set the merge rules of sites while for statistics',
        infoAlert0: 'Click the [New One] button, and the input box for the origin site and the merged site will display, fill in them and save this rule',
        infoAlert1: 'The origin site can be filled with a specific site or regular expression, such as www.baidu.com, *.baidu.com, *.google.com.*, to determine which sites will match this rule while merging',
        infoAlert2: 'The merged site can be filled with a specific site, number, or blank',
        infoAlert3: 'Number means the level of merged site. For example, there is a rule "*.*.edu.cn >>> 3", then "www.hust.edu.cn" will be merged to "hust.edu.cn"',
        infoAlert4: 'Blank means the origin site will not be merged',
        infoAlert5: 'If no rule is matched, it will default to the level before {psl}'
    },
    ja: {
        resultOfOrigin: '不合并',
        resultOfLevel: '{level} 次ドメイン',
        removeConfirmMsg: 'カスタム マージ ルール {origin} は削除されます',
        originPlaceholder: '独自ドメイン名',
        mergedPlaceholder: '統計的ドメイン名',
        errorOrigin: '元のドメイン名の形式が間違っています',
        duplicateMsg: 'ルールはすでに存在します：{origin}',
        addConfirmMsg: 'カスタム マージ ルールが {origin} に設定されます',
        infoAlertTitle: 'このページでは、サブドメインのマージ ルールを設定できます',
        infoAlert0: '[追加] ボタンをクリックすると、元のドメイン名と結合されたドメイン名の入力ボックスがポップアップし、ルールを入力して保存します。',
        infoAlert1: '元のドメイン名には、特定のドメイン名または正規表現 (www.baidu.com、*.baidu.com、*.google.com.* など) を入力できます。 マージ時にこのルールを使用するドメインを決定するには',
        infoAlert2: '統合されたドメイン名の後、特定のドメイン名を入力するか、番号を入力するか、空白のままにすることができます',
        infoAlert3: '数字を記入する場合は、ドメイン名のレベルが予約されていることを意味します。 たとえば、ルール [*.*.edu.cn >>> 3 ] がある場合、www.hust.edu.cn は hust.edu.cn にマージされます。',
        infoAlert4: '記入しない場合は、元のドメイン名が統合されないことを意味します',
        infoAlert5: '一致するルールがない場合、デフォルトで {psl} より前のレベルになります'
    }
}

export default _default
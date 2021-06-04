module.exports = {
    zh_CN: {
        whitelist: {
            label: '白名单',
            addConfirmMsg: '{url} 加入白名单后，将不再统计该网站的数据',
            removeConfirmMsg: '{url} 将从白名单中移除',
            duplicateMsg: '已存在白名单中',
            infoAlert: '白名单内的站点不进行访问统计。'
        },
        merge: {
            label: '子域名合并',
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
            infoAlert5: '如果没有匹配任何规则，则默认合并至 2 级域名'
        },
        confirmTitle: '操作确认',
        successMsg: '操作成功！',
        scoreRequest: '给这个扩展打个分吧！🌟',
        issueRequest: '提点宝贵的建议！💡',
        newOne: '新增',
        save: '保存'
    },
    en: {
        whitelist: {
            label: 'Whitelist',
            addConfirmMsg: 'After {url} is added to the whitelist, no more statistics for it.',
            removeConfirmMsg: '{url} will be removed from the whitelist.',
            duplicateMsg: 'Duplicated',
            infoAlert: 'The sites in the whitelist are not counted'
        },
        merge: {
            label: 'Subdomain Merge',
            resultOfOrigin: 'Not Merge',
            resultOfLevel: 'Keep Level {level}',
            removeConfirmMsg: '{origin} will be removed from customized domain merge rules.',
            originPlaceholder: 'Origin domain',
            mergedPlaceholder: 'Merged domain',
            errorOrigin: 'The format of origin domain is invalid.',
            duplicateMsg: 'The rule already exists: {origin}',
            addConfirmMsg: 'Custom merge rules will be set for {origin}',
            infoAlertTitle: 'This page can configure the merge rules of subdomains',
            infoAlert0: 'Click the Add button, and the input box for the original domain name and the merged domain name will display, fill in them and save this rule',
            infoAlert1: 'The original domain name can be filled with a specific domain name or regular expression, such as www.baidu.com, *.baidu.com, *.google.com.*, to determine which domains will use this rule when merging',
            infoAlert2: 'The merged domain name can be filled with a specific domain name, number, or blank',
            infoAlert3: 'Number means the level of merged domain name. For example, there is a rule "*.*.edu.cn >>> 3", then "www.hust.edu.cn" will be merged to "hust.edu.cn"',
            infoAlert4: 'Blank means the origin domain will not be merge',
            infoAlert5: 'If no rules are matched, it will be merged into the second-level domain name by default'
        },
        confirmTitle: 'Confirm',
        successMsg: 'Successfully!',
        scoreRequest: 'Point me, thanks! 🌟',
        issueRequest: 'Give some precious suggestions! 💡',
        newOne: 'New One',
        save: 'Save'
    },
    ja: {
        whitelist: {
            label: 'ホワイトリスト',
            addConfirmMsg: '{url} がホワイトリストに追加されると、このWebサイトの統計はカウントされなくなります。',
            removeConfirmMsg: '{url} はホワイトリストから削除されます',
            duplicateMsg: '繰り返される',
            infoAlert: 'ホワイトリストのサイトは、訪問統計の対象ではありません。'
        },
        merge: {
            label: 'ドメイン合併',
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
            infoAlert5: '一致するルールがない場合、デフォルトで第 2 レベル ドメイン名にマージされます'
        },
        confirmTitle: '動作確認',
        successMsg: '正常に動作しました！',
        scoreRequest: 'この拡張機能にポイントを与えてください！🌟',
        issueRequest: '貴重な提案をする！💡',
        newOne: '追加',
        save: '保存'
    }
}
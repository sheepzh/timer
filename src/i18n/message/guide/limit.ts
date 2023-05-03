/**
 * Copyright (c) 2023-present Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

export type LimitMessage = {
    title: string
    p1: string
    step: {
        title: string
        enter: string
        click: string
        form: string
        check: string
    }
}

const _default: Messages<LimitMessage> = {
    en: {
        title: 'Limit browsing time of everyday',
        p1: 'If you want to limit the time of browsing certain URLs each day, you can do so by creating a daily time limit rule.',
        step: {
            title: 'Four steps to create a limit rule',
            enter: 'First, enter the management page{link}, click the menu item {menuItem}.',
            click: 'Click the New button in the upper right corner.',
            form: 'Paste the URL that needs to be restricted, and the duration of the restriction. '
                + 'Some URL fragments can be replaced with wildcards as needed, or deleted directly. Then click Save.',
            check: 'Finally, check whether the target URL hits the newly added rule through the Test button in the upper right corner.',
        }
    },
    zh_CN: {
        title: '限制每天的浏览时间',
        p1: '如果你想限制每天浏览某些 URL 的时长，可以通过创建每日时限规则来完成。',
        step: {
            title: '简单四步创建一个限制规则',
            enter: '首先进入管理页{link}，点击菜单项【{menuItem}】。',
            click: '然后单击右上角的新建按钮。',
            form: '粘贴需要限制的 URL，以及限制时长。可以根据需要将部分 URL 片段使用通配符代替，或者直接删除。然后点击保存。',
            check: '最后通过右上角的测试功能检查目标 URL 是否命中了刚添加的规则。',
        }
    },
    zh_TW: {
        title: '限制每天的瀏覽時間',
        p1: '如果你想限制每天瀏覽某些 URL 的時長，可以通過創建每日時限規則來完成。',
        step: {
            title: '簡單四步創建一個限制規則',
            enter: '首先進入管理頁{link}，點擊菜單項【{menuItem}】。',
            click: '然後單擊右上角的新建按鈕。',
            form: '粘貼需要限制的 URL，以及限制時長。可以根據需要將部分 URL 片段使用通配符代替，或者直接刪除。然後點擊保存。',
            check: '最後通過右上角的測試功能檢查目標 URL 是否命中了剛添加的規則。',
        }
    },
    ja: {
        title: '毎日の閲覧時間を制限する',
        p1: '特定の URL を毎日閲覧する時間を制限したい場合は、毎日の時間制限ルールを作成することでこれを行うことができます。',
        step: {
            title: '制限ルールを作成するための 4 つのステップ',
            enter: 'まず、管理ページ{link}に入り、メニュー項目{menuItem}をクリックします。',
            click: '右上隅にある [新規] ボタンをクリックします。',
            form: '制限する必要がある URL と制限の期間を貼り付けます。'
                + '一部の URL フラグメントは、必要に応じてワイルドカードに置き換えたり、直接削除したりできます。 次に、[保存] をクリックします。',
            check: '最後に、右上隅の [テスト] ボタンを使用して、ターゲット URL が新しく追加されたルールに一致するかどうかを確認します。',
        }
    },
}

export default _default

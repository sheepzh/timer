/**
 * Copyright (c) 2023-present Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

export type BackupMessage = {
    title: String
    p1: string
    upload: {
        title: string
        prepareToken: string
        enter: string
        form: string
        backup: string
    }
    query: {
        title: string
        p1: string
        enter: string
        enable: string
        wait: string
        tip: string
    }
}

const _default: Messages<BackupMessage> = {
    en: {
        title: 'Backup data with GitHub Gist',
        p1: 'This extension supports users to backup data using GitHub Gist{link} through simple settings.',
        upload: {
            title: 'Four simple steps to complete the setup',
            prepareToken: 'First, generate a token with gist permissions on GitHub{link}.',
            enter: 'Enter the option page{link}.',
            form: 'Then select GitHub Gist as the synchronization method, '
                + 'and fill in your token in the input box that appears below.',
            backup: 'Click the Backup button to upload local data to your GitHub Gist.',
        },
        query: {
            title: 'How to query data backed up by other browsers?',
            p1: 'If you correctly set the token in the above steps, you can query remote data in just three simple steps.',
            enter: 'First, enter the management page{link}, click the menu item {menuItem}.',
            enable: 'If the token is set correctly, an icon, like {icon}, will appear in the upper right corner of the page, '
                + 'click it to enable the remote query.',
            wait: 'Wait for the data query to complete, and move the mouse over the value to view the data of each client.',
            tip: 'Because remote data is stored in monthly shards, the query time period should not be too long.',
        }
    },
    zh_CN: {
        title: '使用 GitHub Gist 备份数据',
        p1: '这个扩展支持用户通过简单的设置，使用 GitHub Gist{link} 备份数据。',
        upload: {
            title: '简单四步完成设置',
            prepareToken: '首先，您需要在 GitHub 生成一个包含 gist 权限的 token{link}。',
            enter: '进入扩展的选项页面{link}。',
            form: '然后将同步方式选为 GitHub Gist，将你的 token 填入下方出现的输入框中。',
            backup: '最后，点击备份按钮即可将本地数据导入到你的 gist 里。'
        },
        query: {
            title: '如何查询其他浏览器备份的数据？',
            p1: '如果您在上述步骤中正确设置了 token，只需简单三步即可查询远端数据。',
            enter: '首先，进入管理页{link}，点击菜单项【{menuItem}】。',
            enable: '如果 token 设置正确，页面右上角会出现一个{icon}图标，点击它即可开启远端查询。',
            wait: '等待数据查询完毕，将鼠标移动到数值上，即可查看每个客户端的数据。',
            tip: '因为远端数据时按月份分片存放，所以查询时间段不宜过长。',
        }
    },
    zh_TW: {
        title: '使用 GitHub Gist 備份數據',
        p1: '這個擴展支持用戶通過簡單的設置，使用 GitHub Gist{link} 備份數據。',
        upload: {
            title: '簡單四步完成設置',
            prepareToken: '首先，您需要在 GitHub 生成一個包含 gist 權限的 token{link}。',
            enter: '進入擴展的選項頁面{link}。',
            form: '然後將同步方式選為 GitHub Gist，將你的 token 填入下方出現的輸入框中。',
            backup: '最後，點擊備份按鈕即可將本地數據導入到你的 gist 裡。'
        },
        query: {
            title: '如何查詢其他瀏覽器備份的數據？',
            p1: '如果您在上述步驟中正確設置了 token，只需簡單三步即可查詢遠端數據。',
            enter: '首先，進入管理頁{link}，點擊菜單項【{menuItem}】。',
            enable: '如果 token 設置正確，頁面右上角會出現一個{icon}圖標，點擊它即可開啟遠端查詢。',
            wait: '等待數據查詢完畢，將鼠標移動到數值上，即可查看每個客戶端的數據。',
            tip: '因為遠端數據時按月份分片存放，所以查詢時間段不宜過長。',
        }
    },
    ja: {
        title: 'GitHub Gist でデータをバックアップする',
        p1: 'この拡張機能は、簡単な設定で GitHub Gist{link} を使用してデータをバックアップするユーザーをサポートします。',
        upload: {
            title: 'セットアップを完了するための 4 つの簡単なステップ',
            prepareToken: 'まず、GitHub{link} で Gist 権限を持つトークンを生成します。',
            enter: 'オプションページ{link}に入ります。',
            form: '次に、同期方法として GitHub Gist を選択し、下に表示される入力ボックスにトークンを入力します。',
            backup: '[バックアップ] ボタンをクリックして、ローカル データを GitHub Gist にアップロードします。',
        },
        query: {
            title: '他のブラウザでバックアップされたデータを照会する方法は?',
            p1: '上記の手順でトークンを正しく設定すると、わずか 3 つの簡単な手順でリモート データをクエリできます。',
            enter: 'まず、管理ページ{link}に入り、メニュー項目{menuItem}をクリックします。',
            enable: 'トークンが正しく設定されている場合、{icon} のようなアイコンがページの右上隅に表示されるので、それをクリックしてリモート クエリを有効にします。',
            wait: 'データ クエリが完了するのを待ち、値の上にマウスを移動して、各クライアントのデータを表示します。',
            tip: 'リモート データは毎月のシャードに保存されるため、クエリ期間が長すぎないようにする必要があります。',
        }
    },
}

export default _default

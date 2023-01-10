/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

type _QuickstartKey =
    | 'p1'
    | 'l1'
    | 'l2'
    | 'l3'
    | 'p2'

type _BackgroundKey =
    | 'p1'
    | 'l1'
    | 'l2'
    | 'p2'
    | 'backgroundPage'

type _AdvancedKey =
    | 'p1'
    | 'l1'
    | 'l2'
    | 'l3'
    | 'l4'
    | 'l5'
    | 'l6'
    | 'l7'
    | 'l8'

type _BackupKey =
    | 'p1'
    | 'l1'
    | 'l2'
    | 'l3'

export type UsageMessage = {
    quickstart: { [key in _QuickstartKey]: string }
    background: { [key in _BackgroundKey]: string }
    advanced: { [key in _AdvancedKey]: string }
    backup: { [key in _BackupKey]: string }
}

const _default: Messages<UsageMessage> = {
    zh_CN: {
        quickstart: {
            p1: '首先，您可以通过以下几步，开始体验这个扩展：',
            l1: '1. 将扩展的图标固定在浏览器的右上角，具体的操作方法根据您的浏览器而定。该步骤不会影响扩展的正常运行，但是将极大改善您的交互体验。',
            l2: '2. 打开任意一个网站，浏览几秒钟，这时您会观察到右上角的图标上有数字跳动，它显示您今天花了多少时间浏览当前网站。',
            l3: '3. 点击扩展的图标，会弹出一个页面，展示今天或最近一段时间您的上网数据。',
            p2: '需要提醒的是，由于时长数据是实时统计，所以安装扩展之前的浏览记录不会被记录。',
        },
        background: {
            p1: '基于图标，扩展提供了比较便捷的数据查看方式。但是如果您想要体验它的全部功能，就需要访问扩展的 {background}。进入后台页有以下两种方式：',
            l1: '1. 您可以右击扩展的图标，在弹出的菜单中点击【{allFunction}】。',
            l2: '2. 您在图标弹出页的下方也可以找到【{allFunction}】链接，同样点击它即可。',
            p2: '弹出页和后台页是这个扩展最主要的交互方式，当你知道如何打开他们之后，就可以完整地使用它了。',
            backgroundPage: '后台页',
        },
        advanced: {
            p1: '这个扩展的核心功能是统计您在不同网站上的浏览行为。此外，它也提供了很多高级功能，来满足您更多的需求。当然，所有的功能您都可以在后台页里找到。',
            l1: '1. 它可以分析您在一段时间内访问同一个网站的趋势，并以折线图展示。',
            l2: '2. 它可以统计您在每天的不同时间段里的上网频率，并以直方图展示。该数据不区分网站，最小的统计粒度为 15 分钟。',
            l3: '3. 它可以统计您阅读本地文件的时间，不过该功能需要在选项中启用。',
            l4: '4. 它支持白名单功能，您可以将您不想要统计的网站加入白名单。',
            l5: '5. 它支持将几个相关的网站合并统计到同一个条目，您可以自定义合并的规则。默认按照 {psl} 合并。',
            l6: '6. 它支持限制每个网站的每日浏览时长，需要您手动添加限制规则。',
            l7: '7. 它支持夜间模式，同样需要在选项里启用。',
            l8: '8. 它支持使用 Github Gist 作为云端存储多个浏览器的数据，并进行聚合查询。需要您准备一个至少包含 gist 权限的 token。',
        },
        backup: {
            p1: '您可以按以下步骤使用 {gist} 备份您的数据。之后，您可在其他终端上查询已备份数据。',
            l1: '1. 首先，您需要在 Github 生成一个包含 gist 权限的 {token}。',
            l2: '2. 然后在选项页面将同步方式选为 Github Gist，将你的 token 填入下方出现的输入框中。',
            l3: '3. 最后，点击备份按钮即可将本地数据导入到你的 gist 里。'
        },
    },
    zh_TW: {
        quickstart: {
            p1: '首先，您可以通過以下幾步，開始體驗這個擴展：',
            l1: '1. 將擴展的圖標固定在瀏覽器的右上角，具體的操作方法根據您的瀏覽器而定。該步驟不會影響擴展的正常運行，但是將極大改善您的交互體驗。',
            l2: '2. 打開任意一個網站，瀏覽幾秒鐘，這時您會觀察到右上角的圖標上有數字跳動，它顯示您今天花了多少時間瀏覽當前網站。',
            l3: '3. 點擊擴展的圖標，會彈出一個頁面，展示今天或最近一段時間您的上網數據。',
            p2: '需要提醒的是，由於時長數據是實時統計，所以安裝擴展之前的瀏覽記錄不會被記錄。',
        },
        background: {
            p1: '基於圖標，擴展提供了比較便捷的數據查看方式。但是如果您想要體驗它的全部功能，就需要訪問擴展的 {background}。進入後台頁有以下兩種方式：',
            l1: '1. 您可以右擊擴展的圖標，在彈出的菜單中點擊【{allFunction}】。',
            l2: '2. 您在圖標彈出頁的下方也可以找到【{allFunction}】鏈接，同樣點擊它即可。',
            p2: '彈出頁和後台頁是這個擴展最主要的交互方式，當你知道如何打開他們之後，就可以完整地使用它了。',
            backgroundPage: '後台頁',
        },
        advanced: {
            p1: '這個擴展的核心功能是統計您在不同網站上的瀏覽行為。此外，它也提供了很多高級功能，來滿足您更多的需求。當然，所有的功能您都可以在後台頁裡找到。',
            l1: '1. 它可以分析您在一段時間內訪問同一個網站的趨勢，並以折線圖展示。',
            l2: '2. 它可以統計您在每天的不同時間段裡的上網頻率，並以直方圖展示。該數據不區分網站，最小的統計粒度為 15 分鐘。',
            l3: '3. 它可以統計您閱讀本地文件的時間，不過該功能需要在選項中啟用。',
            l4: '4. 它支持白名單功能，您可以將您不想要統計的網站加入白名單。',
            l5: '5. 它支持將幾個相關的網站合併統計到同一個條目，您可以自定義合併的規則。默認按照 {psl} 合併。',
            l6: '6. 它支持限制每個網站的每日瀏覽時長，需要您手動添加限制規則。',
            l7: '7. 它支持夜間模式，同樣需要在選項裡啟用。',
            l8: '8. 它支持使用 Github Gist 作為雲端存儲多個瀏覽器的數據，並進行聚合查詢。需要您準備一個至少包含 gist 權限的 token。',
        },
        backup: {
            p1: '您可以按以下步驟使用 {gist} 備份您的數據。之後，您可在其他終端上查詢已備份數據。',
            l1: '1. 首先，您需要在 Github 生成一個包含 gist 權限的 {token}。',
            l2: '2. 然後在選項頁面將同步方式選為 Github Gist，將你的 token 填入下方出現的輸入框中。',
            l3: '3. 最後，點擊備份按鈕即可將本地數據導入到你的 gist 裡。'
        },
    },
    en: {
        quickstart: {
            p1: 'First, you can quickly start using this extension by following these steps:',
            l1: '1. Pin the icon of this extension in the upper right corner of the browser. The specific operation method depends on your browser.                     This step will not affect the normal behavior of it, but will greatly improve your interactive experience.',
            l2: '2. Visit any website and browse for a few seconds, then you will observe a number jumping on the icon.                    it shows how much time you spent today browsing current website',
            l3: '3. Click the icon, and a page will pop up, showing your stat data for today or recent days.',
            p2: 'It is worth mentioning that since the duration data can only be counted in real time,                     the history before installation will not be recorded.',
        },
        background: {
            p1: 'Based on icons, the extension provides a more convenient way to view data.                     But if you want to experience its full functionality, you need to visit {background} of the extension.                     There are two ways to enter the background page:',
            l1: '1. You can right-click the icon of the extension, and click [{allFunction}] in the pop-up menu.',
            l2: '2. You can also find the [{allFunction}] link at the bottom of the icon popup page, just click it.',
            p2: 'The popup page and background page are the main interaction methods of this extension. After you know how to open them, you can use it completely.',
            backgroundPage: 'the background page',
        },
        advanced: {
            p1: 'The core function of this extension is to count your browsing behavior on different websites.                     In addition, it also provides many advanced functions to meet your more needs.                     Of course, you can find all the functions in the background page.',
            l1: '1. It can analyze the trend of your visiting the same website over a period of time, and display it in a line chart.',
            l2: '2. It can count your surfing frequency in different time periods every day, and display it in a histogram.                     The data is site-agnostic and has a minimum statistical granularity of 15 minutes.',
            l3: '3. It can count the time you read local files, but this function needs to be enabled in the options.',
            l4: '4. It supports the whitelist function, you can add the websites you don\'t want to count to the whitelist.',
            l5: '5. It supports merging statistics of several related websites into the same entry, and you can customize the rules for merging. Merge by {psl} by default.',
            l6: '6. It supports limiting the daily browsing time of each website, which requires you to manually add limiting rules.',
            l7: '7. It supports night mode, which also needs to be enabled in the options.',
            l8: '8. It supports using Github Gist as the cloud to store data of multiple browsers and perform aggregated queries. You need to prepare a token with at least gist permission.',
        },
        backup: {
            p1: 'You can use {gist} to backup your data by following the steps below. \
                Afterwards, you can query the backed up data on other terminals.',
            l1: '1. First, you need to generate a {token} with gist permissions on Github.',
            l2: '2. Then select Github Gist as the synchronization method on the options page, \
                and fill in your token in the input box that appears below.',
            l3: '3. Finally, click the backup button to import the local data into your gist.'
        },
    },
    ja: {
        quickstart: {
            p1: 'まず、次の手順に従って、この拡張機能の調査を開始できます。',
            l1: '1. ブラウザの右上隅にある拡張機能のアイコンを修正します。具体的な操作方法はブラウザによって異なります。                 この手順は、拡張機能の通常の操作には影響しませんが、インタラクティブなエクスペリエンスを大幅に向上させます。',
            l2: '2. 任意の Web サイトを開いて数秒間ブラウジングすると、右上隅のアイコンに数字がジャンプしていることがわかります。                これは、現在の Web サイトの閲覧に今日どれだけの時間を費やしたかを示しています。',
            l3: '3. 拡張機能のアイコンをクリックすると、ページがポップアップし、今日または最近のインターネット データが表示されます。',
            p2: 'なお、継続時間データはリアルタイムでカウントされるため、拡張機能をインストールする前の閲覧履歴は記録されません。',
        },
        background: {
            p1: 'アイコンに基づいて、拡張機能はデータを表示するためのより便利な方法を提供します。                 ただし、完全な機能を体験したい場合は、拡張 {background} にアクセスする必要があります。                 バックグラウンド ページに入る方法は 2 つあります。',
            l1: '1. 拡張機能のアイコンを右クリックし、ポップアップ メニューで [{allFunction}] をクリックします。',
            l2: '2. また、アイコン ポップアップ ページの下部に [{allFunction}] リンクがあり、それをクリックするだけです。',
            p2: 'ポップアップ ページと背景ページは、この拡張機能の主な対話方法であり、それらを開く方法を理解すれば、完全に使用できます。',
            backgroundPage: '背景ページ',
        },
        advanced: {
            p1: 'この拡張機能の主な機能は、さまざまな Web サイトでの閲覧行動をカウントすることです。                 さらに、より多くのニーズを満たすために多くの高度な機能も提供します。                 もちろん、バックグラウンド ページですべての機能を見つけることができます。',
            l1: '1. 一定期間の同じ Web サイトへのアクセスの傾向を分析し、折れ線グラフで表示できます。',
            l2: '2. あなたのネットサーフィン頻度を毎日異なる時間帯でカウントし、ヒストグラムで表示できます。 データはサイトにとらわれず、最小の統計粒度は 15 分です。',
            l3: '3. ローカル ファイルの読み取り時間をカウントできますが、この機能はオプションで有効にする必要があります。',
            l4: '4. ホワイトリスト機能をサポートしており、カウントしたくない Web サイトをホワイトリストに追加できます。',
            l5: '5. 複数の関連 Web サイトの統計を同じエントリにマージすることをサポートし、マージのルールをカスタマイズできます。 デフォルトでは {psl} でマージします。',
            l6: '6. 各 Web サイトの毎日の閲覧時間の制限をサポートしています。これには、制限ルールを手動で追加する必要があります。',
            l7: '7.オプションで有効にする必要があるナイトモードをサポートしています。',
            l8: '8. Github Gist をクラウドとして使用して、複数のブラウザーのデータを保存し、集約されたクエリを実行することをサポートします。                 少なくとも gist 権限を持つトークンを準備する必要があります。',
        },
        backup: {
            p1: '以下の手順に従って、{gist} を使用してデータをバックアップできます。その後、バックアップされたデータを他の端末で照会できます。',
            l1: '1. まず、Github で Gist 権限を持つ {token} を生成する必要があります。',
            l2: '2. 次に、オプション ページで同期方法として [Github Gist] を選択し、下に表示される入力ボックスにトークンを入力します。',
            l3: '3. 最後に、バックアップ ボタンをクリックして、ローカル データを Gist にインポートします。'
        },
    },
}

export default _default
/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

type _key =
    | 'p1'
    | 'p2'

export type ProfileMessage = {
    [key in _key]: string
}

const _default: Messages<ProfileMessage> = {
    zh_CN: {
        p1: '{appName}是一款开源、免费、用户友好的，用于统计上网时间的浏览器扩展。您可以在 {github} 上查阅它的源代码。',
        p2: '这个页面将会告诉您如何使用它，以及相关的隐私政策。',
    },
    zh_TW: {
        p1: '{appName}是一款開源、免費、用戶友好的，用於統計上網時間的瀏覽器擴展。您可以在 {github} 上查閱它的源代碼。',
        p2: '這個頁面將會告訴您如何使用它，以及相關的隱私政策。',
    },
    en: {
        p1: '{appName} is a browser extension to track the time you spent on all websites.You can check out its source code on {github}.',
        p2: 'This page will tell you how to use it, and the related privacy policy.',
    },
    ja: {
        p1: '{appName}は、オンラインで費やした時間をカウントするための、オープン ソースで無料のユーザー フレンドリーなブラウザ拡張機能です。 {github} でソース コードを確認できます。 ',
        p2: 'このページでは、使用方法と関連するプライバシー ポリシーについて説明します。',
    },
}

export default _default
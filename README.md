# Timer

[![codecov](https://codecov.io/gh/sheepzh/timer/branch/main/graph/badge.svg?token=S98QSBSKCR&style=flat-square)](https://codecov.io/gh/sheepzh/timer)
[![codebeat badge](https://codebeat.co/badges/69a88b51-2a07-4944-98dc-603a99d8a9f9)](https://codebeat.co/projects/github-com-sheepzh-timer-main)
[![](https://www.travis-ci.com/sheepzh/timer.svg?branch=main)](https://www.travis-ci.com/sheepzh/timer.svg?branch=main)
[![](https://img.shields.io/badge/license-Anti%20996-blue)](https://github.com/996icu/996.ICU)
[![](https://img.shields.io/github/v/release/sheepzh/timer)](https://github.com/sheepzh/timer/releases)

\[ English | [简体中文](./README-zh.md) \]

Timer is a browser extension to track the time you spent on all websites. It's built by webpack, TypeScript and Element-plus. And you can install it for Firefox, Chrome and Edge.

Timer can 

- help you count the time each website running in your browser.
- help you count the time you browsing and the visit count on each website.
- help you count the time you read local files with browsers.
- help you analyze your browsing habit by time period and display it as a histogram.
- support whitelist to filter out websites that need not stat.
- combine statistics result of multiple sites, and supports to customize the rules of combination.
- support to set the maximum time for browsing a specific website each day to help you keey away from time wasting.
- support to export files formatted _.csv_ and _.json_.
- support dark mode.
- support to sync data with Github Gist across serveral browser clients.

## Install

[![Chrome](https://img.shields.io/chrome-web-store/v/dkdhhcbjijekmneelocdllcldcpmekmm?color=orange&label=Google%20Chrome)](https://chrome.google.com/webstore/detail/%E7%BD%91%E8%B4%B9%E5%BE%88%E8%B4%B5-%E4%B8%8A%E7%BD%91%E6%97%B6%E9%97%B4%E7%BB%9F%E8%AE%A1/dkdhhcbjijekmneelocdllcldcpmekmm?hl=zh-CN)
[![](https://img.shields.io/chrome-web-store/rating/dkdhhcbjijekmneelocdllcldcpmekmm?color=orange&label=rating)](https://chrome.google.com/webstore/detail/%E7%BD%91%E8%B4%B9%E5%BE%88%E8%B4%B5-%E4%B8%8A%E7%BD%91%E6%97%B6%E9%97%B4%E7%BB%9F%E8%AE%A1/dkdhhcbjijekmneelocdllcldcpmekmm?hl=zh-CN)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/users/dkdhhcbjijekmneelocdllcldcpmekmm?color=orange)](https://chrome.google.com/webstore/detail/%E7%BD%91%E8%B4%B9%E5%BE%88%E8%B4%B5-%E4%B8%8A%E7%BD%91%E6%97%B6%E9%97%B4%E7%BB%9F%E8%AE%A1/dkdhhcbjijekmneelocdllcldcpmekmm?hl=zh-CN)

[![Edge](https://img.shields.io/badge/dynamic/json?label=Microsoft%20Edge&prefix=v&query=%24.version&url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%2Ffepjgblalcnepokjblgbgmapmlkgfahc)](https://microsoftedge.microsoft.com/addons/detail/timer-running-browsin/fepjgblalcnepokjblgbgmapmlkgfahc)
[![](https://img.shields.io/badge/dynamic/json?label=rating&suffix=/5&query=%24.averageRating&url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%2Ffepjgblalcnepokjblgbgmapmlkgfahc)](https://microsoftedge.microsoft.com/addons/detail/timer-running-browsin/fepjgblalcnepokjblgbgmapmlkgfahc)
[![](https://img.shields.io/badge/dynamic/json?label=users&query=%24.activeInstallCount&url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%2Ffepjgblalcnepokjblgbgmapmlkgfahc)](https://microsoftedge.microsoft.com/addons/detail/timer-running-browsin/fepjgblalcnepokjblgbgmapmlkgfahc)

[![Firefox](https://img.shields.io/amo/v/2690100?color=green&label=Mozilla%20Firefox)](https://addons.mozilla.org/zh-CN/firefox/addon/web%E6%99%82%E9%96%93%E7%B5%B1%E8%A8%88/)
[![](https://img.shields.io/amo/rating/2690100?color=green)](https://addons.mozilla.org/en-US/firefox/addon/2690100)
[![Mozilla Add-on](https://img.shields.io/amo/users/2690100?color=green)](https://addons.mozilla.org/en-US/firefox/addon/2690100)

![User Count](https://gist.githubusercontent.com/sheepzh/6aaf4c22f909db73b533491167da129b/raw/user_count.svg)

## Contribution

There are some things you can do to contruibute to this software.

#### 1. Submit issues

You can [submit one issue](https://github.com/sheepzh/timer/issues) to us if you have some suggestions, feature requests, or feedback of bugs. And we will reply it as soon as possible.

#### 2. Participate in development

If you know how to develop browser extensions and are familiar with the project's technology stack ( TypeScript + vue3 + ElementPlus ), you can commit your code lines.

#### 3. Perfect translation

In addition to Simplified Chinese, the other localized languages of this software all rely on machine translation. You can also submit translation suggestions with [issues](https://github.com/sheepzh/timer/issues/new?assignees=&labels=locale&template=translation-------.md&title=Report+translation+mistakes).

#### 4. Rate 5 stars

 [Firefox](https://addons.mozilla.org/zh-CN/firefox/addon/web%E6%99%82%E9%96%93%E7%B5%B1%E8%A8%88/) / [Chrome](https://chrome.google.com/webstore/detail/%E7%BD%91%E8%B4%B9%E5%BE%88%E8%B4%B5-%E4%B8%8A%E7%BD%91%E6%97%B6%E9%97%B4%E7%BB%9F%E8%AE%A1/dkdhhcbjijekmneelocdllcldcpmekmm) / [Edge](https://microsoftedge.microsoft.com/addons/detail/timer-the-web-time-is-e/fepjgblalcnepokjblgbgmapmlkgfahc) 

It's simple and much helpful!

## Thanks

<a href="https://www.producteffectivehunt.com/posts/timer?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-timer" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=303723&theme=light" alt="Timer - Count your browsing time and visits on every sites | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

# Time Tracker

[![codecov](https://codecov.io/gh/sheepzh/timer/branch/main/graph/badge.svg?token=S98QSBSKCR&style=flat-square)](https://codecov.io/gh/sheepzh/timer)
[![codebeat badge](https://codebeat.co/badges/69a88b51-2a07-4944-98dc-603a99d8a9f9)](https://codebeat.co/projects/github-com-sheepzh-timer-main)
[![](https://www.travis-ci.com/sheepzh/timer.svg?branch=main)](https://www.travis-ci.com/sheepzh/timer.svg?branch=main)
[![](https://img.shields.io/badge/license-Anti%20996-blue)](https://github.com/996icu/996.ICU)
[![](https://img.shields.io/github/v/release/sheepzh/timer)](https://github.com/sheepzh/timer/releases)
[![Crowdin](https://badges.crowdin.net/timer-chrome-edge-firefox/localized.svg)](https://crowdin.com/project/timer-chrome-edge-firefox)

\[ English | [简体中文](./README-zh.md) \]

Time Tracker is a browser extension to track the time you spent on all websites. It's built by webpack, TypeScript and Element-plus. And you can install it for Firefox, Chrome and Edge.

## Install

[![Chrome](https://img.shields.io/chrome-web-store/v/dkdhhcbjijekmneelocdllcldcpmekmm?color=orange&label=Google%20Chrome)](https://chrome.google.com/webstore/detail/%E7%BD%91%E8%B4%B9%E5%BE%88%E8%B4%B5-%E4%B8%8A%E7%BD%91%E6%97%B6%E9%97%B4%E7%BB%9F%E8%AE%A1/dkdhhcbjijekmneelocdllcldcpmekmm?hl=zh-CN)
[![](https://img.shields.io/chrome-web-store/rating/dkdhhcbjijekmneelocdllcldcpmekmm?color=orange&label=rating)](https://chrome.google.com/webstore/detail/%E7%BD%91%E8%B4%B9%E5%BE%88%E8%B4%B5-%E4%B8%8A%E7%BD%91%E6%97%B6%E9%97%B4%E7%BB%9F%E8%AE%A1/dkdhhcbjijekmneelocdllcldcpmekmm?hl=zh-CN)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/users/dkdhhcbjijekmneelocdllcldcpmekmm?color=orange)](https://chrome.google.com/webstore/detail/%E7%BD%91%E8%B4%B9%E5%BE%88%E8%B4%B5-%E4%B8%8A%E7%BD%91%E6%97%B6%E9%97%B4%E7%BB%9F%E8%AE%A1/dkdhhcbjijekmneelocdllcldcpmekmm?hl=zh-CN)

[![Edge](https://img.shields.io/badge/dynamic/json?label=Microsoft%20Edge&prefix=v&query=%24.version&url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%2Ffepjgblalcnepokjblgbgmapmlkgfahc)](https://microsoftedge.microsoft.com/addons/detail/timer-running-browsin/fepjgblalcnepokjblgbgmapmlkgfahc)
[![](https://img.shields.io/badge/dynamic/json?label=rating&suffix=/5&query=%24.averageRating&url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%2Ffepjgblalcnepokjblgbgmapmlkgfahc)](https://microsoftedge.microsoft.com/addons/detail/timer-running-browsin/fepjgblalcnepokjblgbgmapmlkgfahc)
[![](https://img.shields.io/badge/dynamic/json?label=users&query=%24.activeInstallCount&url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%2Ffepjgblalcnepokjblgbgmapmlkgfahc)](https://microsoftedge.microsoft.com/addons/detail/timer-running-browsin/fepjgblalcnepokjblgbgmapmlkgfahc)

[![Firefox](https://img.shields.io/amo/v/2690100?color=green&label=Mozilla%20Firefox)](https://addons.mozilla.org/zh-CN/firefox/addon/besttimetracker/)
[![](https://img.shields.io/amo/rating/2690100?color=green)](https://addons.mozilla.org/en-US/firefox/addon/2690100)
[![Mozilla Add-on](https://img.shields.io/amo/users/2690100?color=green)](https://addons.mozilla.org/en-US/firefox/addon/2690100)

[How to install manually for Safari](./doc/safari-install.md)

![User Count](https://gist.githubusercontent.com/sheepzh/6aaf4c22f909db73b533491167da129b/raw/user_count.svg)


## Screenshots

<div align="center">
    <img src="./doc/screenshot/popup.png" width="100%">
    <p>Pie Chart on the Popup Page</p>
</div>

<div align="center">
    <img src="./doc/screenshot/app.png" width="100%">
    <p>Dashboard</p>
</div>

<div align="center">
    <img src="./doc/screenshot/analyze.png" width="100%">
    <p>Analytical Report</p>
</div>

<div align="center">
    <img src="./doc/screenshot/habit.png" width="100%">
    <p>Habit Report</p>
</div>

## Contribution

There are some things you can do to contribute to this software.

#### 1. Submit issues

You can [submit one issue](https://github.com/sheepzh/timer/issues) to us if you have some suggestions, feature requests, or feedback of bugs. And we will reply it as soon as possible.

#### 2. Participate in development

If you know how to develop browser extensions and are familiar with the project's technology stack ( TypeScript + vue3 + ElementPlus ), you can commit your code lines.

#### 3. Perfect translation

In addition to Simplified Chinese, the other localized languages of this software all rely on machine translation. You can also submit translation suggestions on [Crowdin](https://crowdin.com/project/timer-chrome-edge-firefox).

#### 4. Rate 5 stars

[Firefox](https://addons.mozilla.org/zh-CN/firefox/addon/web%E6%99%82%E9%96%93%E7%B5%B1%E8%A8%88/) / [Chrome](https://chrome.google.com/webstore/detail/%E7%BD%91%E8%B4%B9%E5%BE%88%E8%B4%B5-%E4%B8%8A%E7%BD%91%E6%97%B6%E9%97%B4%E7%BB%9F%E8%AE%A1/dkdhhcbjijekmneelocdllcldcpmekmm) / [Edge](https://microsoftedge.microsoft.com/addons/detail/timer-the-web-time-is-e/fepjgblalcnepokjblgbgmapmlkgfahc)

It's simple and much helpful!

## Thanks

<a href="https://www.producthunt.com/products/timer-relaunch?utm_source=badge-follow&utm_medium=badge&utm_souce=badge-timer&#0045;relaunch" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/follow.svg?product_id=497735&theme=light" alt="Timer&#0032;&#0040;relaunch&#0041; - Timer&#0032;is&#0032;one&#0032;browser&#0032;extension&#0032;to&#0032;stat&#0032;site&#0032;visits&#0032;and&#0032;time&#0046; | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

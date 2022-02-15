# 网费很贵

[![codecov](https://codecov.io/gh/sheepzh/timer/branch/main/graph/badge.svg?token=S98QSBSKCR&style=flat-square)](https://codecov.io/gh/sheepzh/timer)
[![codebeat badge](https://codebeat.co/badges/69a88b51-2a07-4944-98dc-603a99d8a9f9)](https://codebeat.co/projects/github-com-sheepzh-timer-main)
[![](https://www.travis-ci.com/sheepzh/timer.svg?branch=main)](https://www.travis-ci.com/sheepzh/timer.svg?branch=main)
[![](https://img.shields.io/badge/dynamic/json?color=red&label=active-user&query=total&url=http%3A%2F%2F148.70.16.14%3A12345%2Fusercount%2Ftimer)](http://148.70.16.14:12345/usercount/timer)
[![](https://img.shields.io/badge/license-Anti%20996-blue)](https://github.com/996icu/996.ICU)
[![](https://img.shields.io/github/v/release/sheepzh/timer)](https://github.com/sheepzh/timer/releases)

\[ 简体中文 | [English](./README-en.md) \]

用于上网时间统计的浏览器插件。

- 统计网站的运行时间
- 统计用户在不同网站上的浏览时间
- 统计用户打开网站的次数
- 网站白名单，过滤不需要统计的网站
- 自定义域名合并统计的规则
- 分时段统计分析用户的上网行为并以直方图展示
- 报表导出

## 下载地址

[![Chrome](https://img.shields.io/chrome-web-store/v/dkdhhcbjijekmneelocdllcldcpmekmm?label=Google%20Chrome)](https://chrome.google.com/webstore/detail/%E7%BD%91%E8%B4%B9%E5%BE%88%E8%B4%B5-%E4%B8%8A%E7%BD%91%E6%97%B6%E9%97%B4%E7%BB%9F%E8%AE%A1/dkdhhcbjijekmneelocdllcldcpmekmm?hl=zh-CN)
[![](https://img.shields.io/chrome-web-store/rating/dkdhhcbjijekmneelocdllcldcpmekmm?label=rating)](https://chrome.google.com/webstore/detail/%E7%BD%91%E8%B4%B9%E5%BE%88%E8%B4%B5-%E4%B8%8A%E7%BD%91%E6%97%B6%E9%97%B4%E7%BB%9F%E8%AE%A1/dkdhhcbjijekmneelocdllcldcpmekmm?hl=zh-CN)

[![Firefox](https://img.shields.io/amo/v/2690100?color=green&label=Mozilla%20Firefox)](https://addons.mozilla.org/zh-CN/firefox/addon/web%E6%99%82%E9%96%93%E7%B5%B1%E8%A8%88/)
[![](https://img.shields.io/amo/rating/2690100)](https://addons.mozilla.org/en-US/firefox/addon/2690100)

[![Edge](https://img.shields.io/badge/dynamic/json?label=Microsoft%20Edge&prefix=v&query=%24.version&url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%2Ffepjgblalcnepokjblgbgmapmlkgfahc)](https://microsoftedge.microsoft.com/addons/detail/timer-running-browsin/fepjgblalcnepokjblgbgmapmlkgfahc)
[![](https://img.shields.io/badge/dynamic/json?label=rating&suffix=/5&query=%24.averageRating&url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%2Ffepjgblalcnepokjblgbgmapmlkgfahc)](https://microsoftedge.microsoft.com/addons/detail/timer-running-browsin/fepjgblalcnepokjblgbgmapmlkgfahc)

## 截图

> 弹窗页展示今日数据

<div align="center">
	<img src="./doc/screenshot/popup.png" width="100%">
</div>

> 所有功能

<div align="center">
	<img src="./doc/screenshot/app.png" width="100%">
</div>

---

详细展示图文：[douban.com](https://www.douban.com/group/topic/213888429/)

## 开发

```
 git clone https://github.com/sheepzh/timer.git
 cd timer
 npm install
 # 开发编译，输出目录为 dist_dev
 npm run dev
 # 生产编译，输出目录为 dist_prod 和 market_packages
 npm run build
```

- 欢迎大家 PR， PR 之前请先创建 ISSUE

## TODO

请查看 [功能迭代 RoadMap](https://github.com/sheepzh/timer/projects/1) 项目

## 致谢

<a href="https://www.producthunt.com/posts/timer?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-timer" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=303723&theme=light" alt="Timer - Count your browsing time and visits on every sites | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

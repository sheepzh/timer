# 网费很贵

用于上网时间统计的浏览器插件。

+ 统计网站的运行时间
+ 统计用户在不同网站上的浏览时间
+ 统计用户打开网站的次数
+ 网站白名单，过滤不需要统计的网站
+ 报表导出

详细展示图文：[douban.com](https://www.douban.com/group/topic/213888429/)

## 编译

```
 git clone https://github.com/sheepzh/timer.git
 cd timer
 npm install 
 # 开发编译，输出目录为 dist_dev
 npm run build
 # 生产编译，输出目录为 dist_prod 和 market_packages
 npm run build:prod
```

## DEBUG

+ 在控制台下可以开启日志

```JavaScript
window.timer.openLog()
```

+ 关闭日志

```JavaScript
window.timer.closeLog()
```

## 下载地址

[Firefox](https://addons.mozilla.org/zh-CN/firefox/addon/make-zero/)&emsp;[Chrome](https://chrome.google.com/webstore/detail/make-zero-%E6%96%87%E5%AD%97%E5%8A%A0%E5%AF%86%E5%99%A8/ihpcojcdiclghnggnlkcinbmfpomefcc?hl=zh-CN)&emsp;[Edge](https://microsoftedge.microsoft.com/addons/detail/make-zero-decenc-your-/gkjmpdoddilgcfoeokeajfecogaaocol)

欢迎 star 以及 [issue](https://github.com/sheepzh/timer/issues)
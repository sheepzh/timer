# 开发指南

## 1. 相关技术和工具

使用到的技术栈有：

* [webpack](https://github.com/webpack/webpack) + [TypeScript](https://github.com/microsoft/TypeScript)
* [Vue3 (Composition API)](https://vuejs.org/api/#:~:text=defineCustomElement()-,Composition%20API,-setup())
* [sass](https://github.com/sass/sass)
* [Element Plus](https://element-plus.gitee.io/)
* [echarts](https://github.com/apache/echarts)

以及 [Chrome Extension 开发文档](https://developer.chrome.com/docs/webstore/)，目前 manifest 的版本 Chrome 和 Edge 使用的使 v3, Firefox 使用的是 v2。请注意接口兼容。

还集成了一些免费的开源工具：

* 单元测试工具 [jest](https://jestjs.io/docs/getting-started)
* 单元测试覆盖率 [Codecov](https://app.codecov.io/gh/sheepzh/timer)
* 代码质量检测 [CODEBEAT](https://codebeat.co/projects/github-com-sheepzh-timer-main)
* 多语言翻译管理 [Crowdin](https://crowdin.com/project/timer-chrome-edge-firefox)

## 2. 开发步骤

1. fork 自己的仓库
2. 安装依赖
```shell
npm install
```
3. 创建对应的需求分支
4. code
5. run 开发环境
首先执行命令
```shell
npm run dev
# 在 Firefox 中测试
npm run dev:firefox
# Optional to fix some error caused by node-sass
npm rebuild node-sass
```

项目根目录下会输出两个文件夹，dist_dev 和 firefox_dev。

然后根据测试浏览器的不同导入不同的文件夹到浏览器中：

* Chrome 和 Edge 导入 dist_dev 文件夹
* Firefox 导入 firefox_dev 文件夹下的 manifest.json 文件。
6. 运行单元测试
```shell
npm run test
```
7. 提交代码，并 PR 主仓库的 main 分支

## 3. 应用架构设计

> todo

## 4. 目录结构

```plain
project
│
└───doc                                    # 文档目录
│
└───public                                 # 静态资源目录
|   |   app.html                           # 后台页主界面
|   |   popup.html                         # 弹窗页主界面
|   |   side.html                          # 侧边栏主页面
|   |
|   └───images                             # 图片资源
|       |   icon.png                       # 扩展图标
|
└───src                                    # 代码
|   |   manifest.ts                        # Chrome 和 Edge 的声明文件
|   |   manifest-firefox.ts                # Firefox 的声明文件
|   |   package.ts                         # ../package.json 的声明文件
|   └───api                                # HTTP API 以及扩展 API 的兼容处理
|   |
|   └───app                                # 后台页应用，vue 单页应用
|   |
|   └───popup                              # 扩展图标弹窗页应用，vue 单页应用
|   |
|   └───side                               # 侧边栏页面，vue 单页应用
|   |
|   └───background                         # 后台服务，负责协调数据交互，Service Worker
|   |
|   └───content-script                     # 注入到用户页面里的脚本
|   |
|   └───service                            # 服务层
|   |
|   └───database                           # 数据访问层
|   |
|   └───util                               # 工具包
|   |
|   └───common                             # 公共功能
|
└───test                                   # 单测，主要测试业务逻辑
|   └───__mock__
|       |
|       └───storage.ts                     # mock chrome.storage
|
└───types                                  # 补充声明
|
└───webpack                                # webpack 打包配置

```

## 5. 代码格式

请使用 VSCode 自带的代码格式工具，请<u>**禁用 Prettier Eslint**</u> 等格式化工具
* 尽量使用单引号
* 在符合语法正确情况下，尽量保持代码简洁
* 行尾无分号
* 换行符使用 LF (\n)，Windows 下需要执行以下指令关闭警告
```
git config core.autocrlf false
```

## 6. 多语言处理

用户界面的文本除了特定的专业名词可以使用英语之外，其余请使用多语言框架注入文本。见代码目录 `src/i18n`

### 如何新增多语言条目

1. 在定义文件 `xxx.ts` 中新增一个字段。
2. 然后在对应资源文件 `xxx-resource.json` 中 <u>新增该字段的英语 (en) 和简体中文 (zh_CN) 的对应文本</u> 即可。是否添加其他语种根据开发者的语言能力决定。
3. 在代码中调用 t(文本路径) 获取文本内容。

### 如何与 Crowdin 集成

Crowdin 是一个协作翻译平台，可以让 native 用户帮助翻译多语言内容。该项目与 Crowdin 的集成主要分为两步。

1. 上传英语文本和代码中的其他语种文本

```
# 上传英语原始文本（英语）
ts-node ./script/crowdin/sync-source.ts
# 上传本地代码中其他语种的文本（不包括简体中文）
ts-node ./script/crowdin/sync-translation.ts
```

因为上述两个脚本，依赖在环境变量中的 Crowdin access secret。所以我将它们集成到了 Github 的 [Action](https://github.com/sheepzh/timer/actions/workflows/crowdin-sync.yml) 中，直接点击执行即可。

2. 导出 Crowdin 中翻译完成的内容

```
ts-node ./script/crowdin/export-translation.ts
```

同样也可以直接执行 [Action](https://github.com/sheepzh/timer/actions/workflows/crowdin-export.yml)。

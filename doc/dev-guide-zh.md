# 开发指南

## 1. 相关技术和工具

使用到的技术栈有：

-   [webpack](https://github.com/webpack/webpack) + [TypeScript](https://github.com/microsoft/TypeScript)
-   [Vue3 (Composition API + JSX)](<https://vuejs.org/api/#:~:text=defineCustomElement()-,Composition%20API,-setup()>)
-   [sass](https://github.com/sass/sass)
-   [Element Plus](https://element-plus.gitee.io/)
-   [Echarts](https://github.com/apache/echarts)

以及 [Chrome Extension 开发文档](https://developer.chrome.com/docs/webstore/)，目前 manifest 的版本 Chrome 和 Edge 使用的使 v3, Firefox 使用的是 v2。请注意接口兼容。

还集成了一些免费的开源工具：

-   单元测试工具 [jest](https://jestjs.io/docs/getting-started)
-   单元测试覆盖率 [Codecov](https://app.codecov.io/gh/sheepzh/timer)
-   端到端集成测试 [puppeteer](https://developer.chrome.com/docs/extensions/how-to/test/puppeteer)
-   代码质量检测 [CODEBEAT](https://codebeat.co/projects/github-com-sheepzh-timer-main)
-   多语言翻译管理 [Crowdin](https://crowdin.com/project/timer-chrome-edge-firefox)

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
```

项目根目录下会输出两个文件夹，dist_dev 和 dist_dev_firefox

然后根据测试浏览器导入不同目标到浏览器中：

-   Chrome 和 Edge 导入 dist_dev 文件夹
-   Firefox 导入 dist_dev_firefox 文件夹下的 manifest.json 文件

6. 运行单元测试

```shell
npm run test
```

7. 运行端到端的集成测试

首先需要编译两次：集成编译和生产编译

```shell
npm run dev:e2e
npm run build
```

然后执行测试

```shell
npm run test-e2e
```

如果需要使用 headless 模式启动 puppeteer，可以设置以下环境变量

```bash
export USE_HEADLESS_PUPPETEER=true
```

7. 提交 PR

请 PR 到主仓库的 milestone 分支，一般是下一次发布的次版本号（x.x.0）。如果没有，请联系作者添加

## 3. 应用架构设计

> todo

## 4. 目录结构

```plain
project
│
└───doc                                    # 文档
│
└───public                                 # 静态资源
|
└───src
|   |   manifest.ts                        # Chrome 和 Edge 的声明文件
|   |   manifest-firefox.ts                # Firefox 的声明文件
|   |
|   └───api                                # HTTP API 以及扩展 API 的兼容处理
|   |
|   └───pages                              # 用户界面相关代码
|   |   |
|   |   └───app                            # 后台页
|   |   |
|   |   └───popup                          # 弹窗页
|   |   |   |
|   |   |   └───skeleton.ts                # 弹窗页骨架屏，加速打开速度
|   |   |   |
|   |   |   └───index.ts                   # 弹窗页真实界面
|   |   |
|   |   └───side                           # 侧边栏
|   |   |
|   |   └───[其他目录]                      # 公共代码
|   |
|   └───background                         # 后台服务，负责协调数据交互，Service Worker
|   |
|   └───content-script                     # 注入到用户页面里的脚本
|   |
|   └───service                            # 服务层
|   |
|   └───database                           # 数据访问层
|   |
|   └───i18n                               # 多语言
|   |
|   └───util                               # 工具包
|   |
|   └───common                             # 公共功能
|
└───test                                   # 单测
|   └───__mock__
|       |
|       └───storage.ts                     # mock chrome.storage
|
└───test-e2e                               # 端到端测试
|
└───types                                  # 补充声明
|
└───webpack                                # webpack 打包配置

```

## 5. 代码格式

请使用 VSCode 自带的代码格式工具，请<u>**禁用 Prettier Eslint**</u> 等格式化工具

-   尽量使用单引号
-   在符合语法正确情况下，尽量保持代码简洁
-   行尾无分号
-   换行符使用 LF (\n)，Windows 下需要执行以下指令关闭警告

```
git config core.autocrlf false
```

## 6. 多语言处理

用户界面的文本除了特定的专业名词可以使用英语之外，其余请使用多语言框架注入文本。见代码目录 `src/i18n`

### 如何新增多语言条目

1. 在定义文件 `xxx.ts` 中新增一个字段。
2. 然后在对应资源文件 `xxx-resource.json` 中 <u>新增该字段的英语 (en) 和简体中文 (zh_CN) 的对应文本</u> 即可。
3. 在代码中调用 t(文本路径) 获取文本内容。

### 如何与 Crowdin 集成

Crowdin 是一个协作翻译平台，可以让 native 用户帮助翻译多语言内容。该项目与 Crowdin 的集成主要分为两步。

1. 上传英语文本和代码中的其他语种文本

```
# 上传英语原始文本
ts-node ./script/crowdin/sync-source.ts
# 上传本地代码中其他语种的文本（不包括简体中文）
ts-node ./script/crowdin/sync-translation.ts
```

因为上述两个脚本，依赖在环境变量中的 Crowdin access secret。所以我将它们集成到了 Github 的 [Action](https://github.com/sheepzh/timer/actions/workflows/crowdin-sync.yml) 中。

2. 导出 Crowdin 中翻译完成的内容

```
ts-node ./script/crowdin/export-translation.ts
```

同样也可以直接执行 [Action](https://github.com/sheepzh/timer/actions/workflows/crowdin-export.yml)。

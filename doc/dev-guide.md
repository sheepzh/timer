# 开发指南

## 1. 相关技术和工具

使用到的技术栈有：

* [webpack](https://github.com/webpack/webpack) + [TypeScript](https://github.com/microsoft/TypeScript)
* [Vue3 (Composition API)](https://vuejs.org/api/#:~:text=defineCustomElement()-,Composition%20API,-setup())
* [sass](https://github.com/sass/sass)
* [Element Plus](https://element-plus.gitee.io/)
* [echarts](https://github.com/apache/echarts)

以及 [Chrome Extension 开发文档](https://developer.chrome.com/docs/webstore/)，目前 manifest 的版本为 V2，V3 正在迁移中 (对应分支 [mv3](https://github.com/sheepzh/timer/tree/mv3))

还集成了一些免费的开源工具：

* 单元测试工具 [jest](https://jestjs.io/docs/getting-started)
* 单元测试覆盖率 [Codecov](https://app.codecov.io/gh/sheepzh/timer)
* 集成测试套件 [Travis CI](https://app.travis-ci.com/github/sheepzh/timer)

## 2. 开发步骤

1. fork 自己的仓库
2. 安装依赖
```shell
npm install
# or 
yarn install
```
3. 创建对应的需求分支
4. code
5. run 开发环境
首先执行命令
```shell
npm run dev
# or
yarn run dev
```

项目根目录下会输出两个文件夹，dist_dev 和 firefox_dev。

然后根据测试浏览器的不同导入不同的文件夹到浏览器中：

* Chrome 和 Edge 导入 dist_dev 文件夹
* Firefox 导入 firefox_dev 文件夹下的 manifest.json 文件。
6. 运行单元测试
```shell
npm run test
# or 
yarn run test
```
7. 提交代码，并 PR 主仓库的 main 分支

## 3. 应用架构设计

> todo 

## 4. 目录结构

```plain
project
|   package.json
|   jest.config.ts                         # jest 配置
│   tsconfig.json                          # TypeScript 配置
|   global.d.ts                            # 命名空间声明
|   .travis.yml                            # 集成测试任务配置
│   README.md
│
└───doc                                    # 文档目录
│
└───public                                 # 静态资源目录
|   |   app.html                           # 后台页主界面
|   |   popup.html                         # 弹窗页主界面
|   |
|   └───images                             # 图片资源
|       |   icon.png                       # 扩展图标
|
└───src                                    # 代码
|   |   manifest.ts                        # 扩展的声明文件
|   |   package.ts                         # ../package.json 的声明文件
|   └───api                                # HTTP api
|   |
|   └───app                                # 后台页应用，一个 vue 单页应用
|   |
|   └───popup                              # 扩展图标弹窗页应用，也是个 vue 单页应用
|   |
|   └───background                         # 扩展的后台服务，负责协调数据交互
|   |
|   └───content-script                     # 注入到用户页面里的脚本
|   |
|   └───service                            # 服务层
|   |
|   └───database                           # 数据访问层
|   |
|   └───entity                             # 业务数据抽象
|   |
|   └───util                               # 工具包
|   |
|   └───common                             # 公共功能
|
└───test                                   # 单测，主要测试业务逻辑
|   └───__mock__
|   |   |   storage.ts                     # mock chrome.storage
|   |
|   └───database                           # database 单测
|   |
|   └───entity                             # entity 单测
|   |
|   └───service                            # service 单测
|   |
|   └───util                               # util 单测
| 
└───types                                  # 补充声明
| 
└───webpack                                # webpack 打包配置
    |   webpack.common.ts                  # 基础配置
    |   webpack.dev.ts                     # 开发环境配置
    |   webpack.prod.ts                    # 生产配置

```

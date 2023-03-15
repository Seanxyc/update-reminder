# update-reminder

A tool to check version updates for web application.

## 安装

- Requires Node14+

```bash
// npm
npm install update-reminder

// yarn
yarn add update-reminder

// pnpm
pnpm install updade-reminder
```

## 快速开始

1. 导入 ` checkVersion()`函数并调用

   ```javascript
   // 入口文件: 如 App.vue

   import { checkVersion } from '@eastmoney/update-reminder'
   // 推荐使用 package.json 中的 version 字段, 也可自定义 version
   import { version } from '../package.json'

   // 调用 checkVersion
   checkVersion({
     localPackageVersion: version,
     originVersionFileUrl: './version.json',
     // 更多配置选项请参考 API
   })

   // 如需终止版本检测时, 在销毁生命周期中, 调用 unCheckVersion 方法进行终止, 详情参见 API
   unCheckVersion({ closeDialog: false })
   ```

2. 执行 `generate-version-file` 命令，在指定目录生成 `version.json`文件

   - 支持环境变量参数(可选)

     - `VERSION` 需要**自定义 version** 时传入, 默认取 package.json 的 version 字段
     - `EXTERNAL` 希望将更多信息存到 `version.json` 中时传入
     - `EXTERNAL_PATH` 接收一个文件路径, 推荐在需要将大量额外信息写入 `version.json` 中时使用，优先级低于 `EXTERNAL`

   - 设置方式

     - ```json
       // package.json

       {
         ...
         "scripts": {
           ...
           // Mac 或 Linux 系统
           "generate:version": "VERSION=1.1.0-0 generate-version-file dist public"
           // Windows 系统先安装 cross-env
           // npm install cross-env -D
           "generate:version": "cross-env VERSION=1.1.0-0 generate-version-file dist public"
           ...
         },
         ...
       }
       ```

     - ```json
       // package.json

       {
         ...
         "scripts": {
           ...
           // Mac 或 Linux 系统 （简单文本）
           "generate:version": "EXTERNAL='some text' generate-version-file dist public"
           // Mac 或 Linux 系统 （JSON 文本）
           "generate:version": "EXTERNAL='{\"update\":\"fix bugs\",\"content\":\"some tips\"}' generate-version-file dist public"
           // Mac 或 Linux 系统 （JSON 文件, 如 version-external.json）
           "generate:version": "EXTERNAL_PATH=version-external.json generate-version-file dist public"
           // Windows 系统 (简单文本)
           "generate:version": "set EXTERNAL=some text && generate-version-file dist public"
           // Windows 系统 (JSON 文本)
           "generate:version": "set EXTERNAL={\"update\":\"fix bugs\",\"content\":\"some tips\"} && generate-version-file dist public"
           // Windows 系统 （JSON 文件, 如 version-external.json）
           "generate:version": "set EXTERNAL_PATH=version-external.json && generate-version-file dist public"
           ...
         },
         ...
       }

       ```

## API

- **checkVersion**

  | 参数                              | 类型                                                                                                               | 描述                                                                                          | 默认值                 | 必需 |
  | --------------------------------- | ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- | ---------------------- | ---- |
  | config                            | object                                                                                                             | 版本监测配置项                                                                                |                        | 是   |
  | config.originVersionFileUrl       | string                                                                                                             | 服务器上的 version.json 文件路径                                                              |                        | 是   |
  | config.localPackageVersion        | string                                                                                                             | 当前应用版本号, 默认取 package.json 的 version 字段, 用于与远程服务器的 version.json 文件比较 |                        | 是   |
  | config.pollingTime                | number                                                                                                             | 轮询监测的时间间隔, 单位 ms                                                                   | 5000                   | 否   |
  | config.immediate                  | boolean                                                                                                            | 第一次访问时, 立即触发版本监测, 之后按自定义时间间隔轮询                                      | false                  | 否   |
  | config.onVersionUpdate            | function(data)                                                                                                     | 自定义版本提示 UI 的回调函数                                                                  |                        | 否   |
  | config.onRefresh                  | function(data)                                                                                                     | 自定义 refresh 事件的回调函数, data 为最新版本号                                              |                        | 否   |
  | config.onCancel                   | function(data)                                                                                                     | 自定义 cancel 事件的回调函数, data 为最新版本号                                               |                        | 否   |
  | options                           | object                                                                                                             | 弹窗文案和主题的配置项 (不自定义弹窗 UI, 但有修改文案和主题的需求时使用)                      |                        | 否   |
  | options.title                     | string                                                                                                             | 弹窗的标题                                                                                    | 提示                   | 否   |
  | options.description               | string                                                                                                             | 弹窗的描述                                                                                    | 检测到新版本           | 否   |
  | options.buttonText                | string                                                                                                             | 弹窗按钮 text                                                                                 | 刷新                   | 否   |
  | options.cancelButtonText          | string                                                                                                             | 关闭弹窗按钮的文案 (默认不展示)                                                               |                        | 否   |
  | options.cancelMode                | ignore-current-version (当前版本不再提示) / ignore-today (今天不再提示) / ignore-current-window (当前窗口不再提示) | 关闭弹窗的模式 (设置 ancelButtonText 后生效)                                                  | ignore-current-version | 否   |
  | options.cancelUpdateAndStopWorker | boolean                                                                                                            | 关闭弹窗时, 停止 worker (当 cancelButtonText 设置后生效)                                      | false                  | 否   |
  | options.buttonStyle               | string                                                                                                             | 弹窗按钮的 css 配置, 可以覆盖掉默认的按钮样式                                                 |                        | 否   |

- **unCheckVersion 方法**

  终止调用 `checkVersion` 后创建的 `worker` 进程

  | 参数        | 类型    | 描述                     | 默认值 | 必需 |
  | ----------- | ------- | ------------------------ | ------ | ---- |
  | closeDialog | boolean | 是否关闭版本更新提示弹窗 | false  | 否   |
  | closeWorker | boolean | 是否停止 worker 轮询     | true   | 否   |

以下是运行插件的步骤，更多详情请查看开发者文档：

 https://js.design/developer-doc/Guide/2.Development/1.Intro

本插件模板使用 Typescript 和 NPM，这是创建 JavaScript 应用程序的两个标准工具；

首先，下载Node.js，它带有NPM，这将使你能够安装TypeScript和其他库。
下载链接：https://nodejs.org/en/download/

下一步，运行如下命令安装Typescript:

  npm install -g typescript

然后在你的插件路径下, 通过运行下面两种中的任一命令获取插件 API 的最新类型定义:

  npm i --save-dev @jsdesigndeveloper/plugin-typings
  or
  yarn add -D @jsdesigndeveloper/plugin-typings

如果你熟悉 JavaScript,那么TypeScript看起来也会非常熟悉，实际上，类型严谨的 JavaScript 就是TypeScript

更多信息, 请参阅 https://www.typescriptlang.org/

使用TypeScript需要一个编译器将 TypeScript（code.ts）转换为JavaScript（code.js） 以便在浏览器上运行。

推荐使用 VS code 编辑器:

1. 下载 VS Code 编辑器 : https://code.visualstudio.com/.
2. 在 VS Code 编辑器中打开文件
3. 将 TypeScript 编译成 JavaScript: 运行  "终端 > 运行构建项目" 菜单项,
   然后选择 "tsc: watch - tsconfig.json". 当你每次重新打开 Visual Studio Code 时你都要完成上述该操作

VS Code 会在你每次保存时重新生成新 JavaScript 文件。

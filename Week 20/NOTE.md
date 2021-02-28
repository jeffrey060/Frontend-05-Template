学习笔记

持续集成 - 发布前检查   

最终阶段集成：前面各自开发，最终集成联调   
在持续集成被提出之前，客户端主要的开发模式就是最终阶段集成   

持续集成概念：
* daily build：每天晚上全局build一次，是否可以build成功
* BVT：build verification test，构建的验证测试，属于一种冒烟测试，测试case一般都是最基本最简单的case，对build成功之后的结果进行一个基本的验证

对于前端来说，build时间相对较短，可以选择在提交的时候进行build和基本的验证   
互联网企业一般1-2周的上线周期   

在客户端时代，BVT是由测试工程师来提供，属于end to end的测试，会涉及一些UI上面的操作，所以一般单元测试是没有办法覆盖的  
测试工程师产生case的成本高，对于前端这种短周期的开发来说，不太合适

采用一种更轻量级的检查方式：
* lint：对代码风格和一些常见的代码模式做一些校验
如果想要做比较完整的测试，可以使用PhantomJS无头浏览器进行测试   

前端做持续集成，可以利用无头浏览器把整棵DOM树生成出来,然后检查DOM树里面特定的某些格式   
DOM树里可以通过CSSOM拿到元素的位置，背景图以及元素的一些结构   
客观上，使用无头浏览器，可以配合一些规则校验，最后完成BVT任务   

* 通过Git Hook来完成检查的时机
* ESLint：轻量级代码检查方案
* PhantomJS（Deprecated）：基于无头浏览器对代码最后生成出来的样子，做一些规则的校验和检查
* Chrome Headless模式 - puppeteer库

.git/hook/*.sample
* applypatch-msg.sample
* commit-msg.sample
* fsmonitor-watchman.sample
* post-update.sample
* pre-applypatch.sample
* pre-commit.sample：lint之类的操作会放到pre-commit里面
* pre-push.sample：最终check的操作放到pre-push里面
* pre-rebase.sample
* pre-receive.sample：
* prepare-commit-msg.sample
* update.sample
去掉.sample后缀，变为linux可执行文件，shell脚本编写
```sh
$ which node
/usr/local/bin/node

$ ls -l ./pre-commit
-rw-r--r-- ./pre-commit

$ chmod +x ./pre-commit

$ ls -l ./pre-commit
-rwxr-xr-x ./pre-commit
```
./pre-commit:
```js
#!/usr/bin/env node
let process = require("process");

console.log("Hello Hooks!");

process.exitCode = 1;
```
git hooks 是本地的，无法clone。可以借助 https://github.com/typicode/husky 来保证每个人都有hooks   

ESLint 基本用法:
- 安装
  ```
    npm install eslint --save-dev
  ```  
  💡 一定是--save-dev
- 初始化
  ```
    npx eslint --init
  ```  
  会生成配置文件`.eslintrc.js`
- 用法
  ```
    npx eslint yourfile.js
  ```
- 💡 检查需要提交的版本而不一定是现在文件呈现的版本。需要用到git的一个命令  `git stash push -k`

Git与ESLint结合
git add后手动修改代码，导致eslint校验修改后的代码，而不是已add的代码   
git stash
```sh
$ git stash push -k
$ git stash list
$ git stash pop
```
可以用child process去放到hooks里面去，或者让用户去学习git stash命令   
```js
#!/usr/bin/env node
let process = require("process");
let child_process = require("child_process");
const {ESlint, ESLint} = require("eslint");

function exec(name) {
  return new Promise(function(resolve) {
    child_process.exec(name, resolve);
  });
}

(async function main() {
  const eslint = new ESLint({fix: false});

  await exec("git stash push -k");  
  const results = await eslint.lintFiles(["**/git-demo/index.js"]);
  await exec("git stash pop");

  const formatter = await eslint.loadFormatter("stylish");
  const resultText = formatter.format(results);

  console.log(resultText);
  
  for (let result of results) {
    if (result.errorCount) {
      process.exitCode = 1;
    }
  }
})().catch((error) => {
  process.exitCode = 1;
  console.error(error);
});
```

服务端的git系统多数提供了一个web hooks的能力   
web hooks不是git本身的能力，需要根据实际情况去获取它的API  

服务端检查具有强制性   
客户端检查防君子不防小人，可以绕过   

Chrome Headless模式   
https://developers.google.com/web/updates/2017/04/headless-chrome?hl=en

Chrome puppeteer库  
```sh
$ npm i puppeteer
```
```js
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:8080/main.html');
  const a = await page.$('a');
  console.log(await a.asElement.boxModel());

  const img = await page.$$('a');
  console.log(img);
})();

```
*无头浏览器
  1. 可以在无GUI的状态下模仿浏览器访问页面，并提供API给程序员调试渲染结果的工具
  1. chromium系浏览器可添加`--headless`参数来启动无头浏览器模式
  1. 可以使用Node模块`puppeteer`来访问Chromium无头浏览器的API用于调试渲染结果，以方便的编写集成测试和验证脚本
## 毕业总结

* 我通过前端训练营得到了什么？
  1. 对前端知识体系进行了系统性的补课，深入了解了html css js三驾马车的深层实现，浏览器工作实现原理；
  1. 回顾了dfs，dfs等基础算法的前端应用，面向AST编程的学习
  1. 了解了proxy与双向绑定
  1. 对于已有的一些前端框架，通过学习已经获得了深入源码并进行针对性优化的能力，除了UI库，现在更能开发前端脚手架等工具链开发工具，这在未来的工作提供极大的帮助
  

# toolchain的搭建
1. npm初始化项目的命令
```shell
npm init 
//name项需要以 generator-开头，比如generator-toolchain
```
2. 安装yeoman的命令
```shell
yarn add yeoman-generator
```

3. 建立项目文件夹和文件的命令
```shell
mkdir -p generators/app
touch generators/app/index.js
```

4. 编写generators/app/index.js文件
```js
var Generator = require("yeoman-generator");

module.exports = class extends Generator {
	constructor(args, opts) {
		super(args, opts);
	}

	method1() {
		console.log("this is method1");
	}

	method2() {
		console.log("this is method2");
	}
};
```

5. 根目录运行命令测试的命令
```shell
npx yo toolchain
```

6. 使用异步function与用户进行交互,修改generators/app/index.js文件, 在method2后新增一个方法，内容如下:
```js
	async prompting() {
		const answers = await this.prompt([
			{
				type: "input",
				name: "name",
				message: "Your project name",
				default: this.appname, // Default to current folder name
			},
			{
				type: "confirm",
				name: "cool",
				message: "Would you like to enable the Cool feature?",
			},
		]);

		this.log("app name", answers.name);
		this.log("cool feature", answers.cool);
	}
```
然后就运行npx yo toolchain测试与用户的交互

7. yeoman的文件系统的用法：
https://yeoman.io/authoring/file-system.html

8. yeoman的依赖管理：（第三方模块的安装）
https://yeoman.io/authoring/dependencies.html

# webpack了解
		build是同时为开发和发布服务的基础设施。webpack最初设计是为了nodejs服务，他的核心思路是最终打包成一个可用js文件，然后通过手动引入到html文件中，过程全是js，没有html，现在有后起之秀打包工具基于html，配置要求没那么高。
		webpack配置文件采用commonjs规范：导出一个对象，包含几个基础模块：entry, output, module, plugin
            
```
module.exports = {
	entry: "",
	output: "",
	module: {
		rules:[]
	}，
	plugins: [],
	resolve: { 
		alias: {// 开发中经常用到，实在resolve模块下
			Utilities: path.resolve(__dirname, 'src/utilities/'),
			Templates: path.resolve(__dirname, 'src/templates/')
		}
	}

}
```
- **webapck 可以做什么？**
  - 多文件合并。通过 loader 和 plugin ，来订制合并规则和文本转换。
- **使用webpack需要安装两个基础安装包**
  - `webpack-cli`: 提供 webpack 命令（不包括在 webpack 依赖中）
  - `webpack`：是核心
- **一个全新的 webpack 项目**

  - **安装 webpack**
    - 全局安装
      ```
      npm install -g webpack-cli webpack
      ```
    - 项目中安装
      ```
      npm install webpack-cli --save-dev
      npx webpack
      ```
  - **webpack.config.js**

    - entry: 入口文件
    - output：输出文件名和路径
    - **loader**：文本转换（source => 目标代码）

      ```js
      module.exports = {
        module: {
          rules: [
            { test: /\.css$/, use: "css-loader" },
            { test: /\.ts$/, use: "ts-loader" },
          ],
        },
      };
      ```

      loader.js

      ```js
      import { getOptions } from "loader-utils";
      import { validate } from "schema-utils";

      const schema = {
        type: "object",
        properties: {
          test: {
            type: "string",
          },
        },
      };

      export default function (source) {
        const options = getOptions(this);

        validate(schema, options, {
          name: "Example Loader",
          baseDataPath: "options",
        });

        // Apply some transformations to the source...

        return `export default ${JSON.stringify(source)}`;
      }
      ```
# babel
		Babel 是一个工具链，主要用于将 ECMAScript 2015+ 版本的代码转换为向后兼容的 JavaScript 语法，以便能够运行在当前和旧版本的浏览器或其他环境中。下面列出的是 Babel 能为你做的事情：
* 语法转换
* 通过 Polyfill 方式在目标环境中添加缺失的特性 (通过 @babel/polyfill 模块)
* 源码转换 (codemods)
## preset
		babel的preset是预设的一些转换规则，需要进行配置才能使用，最简单的配置方法，是创建一个.babelrc文件，里面以一个json对象的方式存储配置。
```json
{
	"presets":["@babel/preset-env"]
}
```
## 其他

- **`npm link`**

  - 本地开发 npm 模块时，可以使用 `npm link` 命令，将 npm 模块链接到对应的运行项目中去，方便对模块进行调试和测试。

  - ```
    npm link (in package dir)
    npm link [<@scope>/]<pkg>[@<version>]
    alias: npm ln
    ```
  - [使用](https://www.jianshu.com/p/aaa7db89a5b2)

    - `npm-link-module`: 要开发的 npm 模块,
    - `npm-link-example`: 要运行 npm 模块的项目
    - ```
      cd npm-link-module
      npm link

      cd npm-link-example
      npm link npm-link-module
      ```

    - 在 npm-link-example 引用然后运行
      ```js
      require("npm-link-module");
      ```

- **npx**

  - 主要特点

    1. 临时安装可执行依赖包，不用全局安装，不用担心长期的污染。
    2. 可以执行依赖包中的命令，安装完成自动运行。
    3. 自动加载 node_modules 中依赖包，不用指定$PATH。
    4. 可以指定 node 版本、命令的版本，解决了不同项目使用不同版本的命令的问题。

    ```
    npx用来解决全局命令行工具只能有一个的问题。

    比如装个webpack,使用的是4.x，可是已经装了全局的1.x版本并且还要继续使用，这个时候可以不装在全局，用npx webpack代替webpack命令，互不干扰。
    ```
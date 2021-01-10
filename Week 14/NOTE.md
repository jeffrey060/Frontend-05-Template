学习笔记
学习笔记

# 组件化

组件化是 HTML 的扩展，目的就是提高复用性

### 组件基础

组件由 Markup 和 js 组成。

#### 对象和组件

1. 对象

- Properties
- Methods
- Inherit

2. 组件
   组件通常含有 UI，所以有多出的属性

- Properties
- Methods
- Inherit
- Attribute
- Config & State 组件的配置和状态
- Event 组件会传递事件
- Lifecycle 组件拥有自己的生命周期
- Children 树形结构

![](./组件描述.png)

#### Attribute vs Property

Attribute 通常指标签上的属性
Property 通常指对象上的属性，或者组件中传入的属性

#### 如何设计组件状态

config
一般是初始配置，一次性传入，不支持后续改动

state
是指组件内部的状态，跟组件的交互和数据相关
一般由用户操作改变，开发者不能改变

#### 组件生命周期

- created
- mount/unmount
- update
- destroyed

#### children

content 型
组件由子组件组成，子组件啥样就是啥样

template 型
子组件是动态的，比如列表，传入 listData，就渲染出一个列表组件

### 为组件添加 JSX

1. 初始化项目
   `npm init -y`
   依次安装

```
npm install webpack webpack-cli babel-loader @babel/core @babel/preset-env @babel/plugin-transform-react-jsx -D
```

注意，配合 webpack-dev-server 使用时，必须安装 webpack-cli@3 的版本，现在 webpack-cli@4 会报错

2. 新建入口文件 main.js

```js
for (let i = 0; i < 10; i++) {
  console.log(i)
}

const mydiv = <div className="myclass">123</div>
```

3. 新建 webpack.config.js

```js
module.exports = {
  entry: './main.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          // 编译babel，转成es5
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-react-jsx'], // 编译jsx
          },
        },
      },
    ],
  },
  mode: 'development', // 去掉就是生产模式
}
```

### 手动实现 jsx 组件

1.通过 jsx 结果逆推出需要的函数，用来实现组件中普通节点(div,span)，文本节点和自定义组件

2.可以推出 jsx 的基本入参结构是
[type,attributes,...children]

3.对于元素的属性，可以使用 for in 进行遍历，逐个 setAttribute

4.对于子节点 children，使用 for of 进行遍历，逐个 appendChild
注意文本节点需要 document.createTextNode 来得到文本节点，才能 append

5.对于自定义组件，这里 jsx 认为它是一个 class，所以需要自定义一个 class，同样实现设置属性，添加子节点，以及让父节点添加自己的方法
然后在自定义的 createElement 中，发现是 class，实例化即可
具体代码，参考 framework.js

### 组件的基本知识 | 为组件添加JSX语法

    1、npm install --save-dev webpack babel-loader //按照webpack
    2、npm install --save-dev @babel/core @babel/preset-env //按照babel
    3、npm install --save-dev @babel/plugin-transform-react-jsx  //按照j
    4、配置webpack
    5、npm install --save-dev webpack-dev-server //自动监听文件变化自动打包

### 编程技巧
    1、获取一个固定在0-n中间的数，用取余方法
    let n = 10;
    let currentIndex = 0;
    ++currentIndex;
    let nextIndex = currentIndex % n;
    2、浏览器渲染的时间是16毫秒/帧,1000/60hz=16.666666666,一般屏幕的刷新频率是60hz每秒
    3、requestAnimationFrame和setTimeout详解及对比
    想在浏览器下次重绘之前继续更新下一帧动画，那么回调函数自身必须再次调用window.requestAnimationFrame()
    window.cancelAnimationFrame()
    4、拖动事件监听三部曲
        this.root.addEventListener("mousedown", event => {
        let move = (e) => {
            console.log('mousemove');
        }

        let up = (e) => {
            console.log('mouseup');
            document.removeEventListener('mousemove', move);
            document.removeEventListener('mouseup', up);
        }
        console.log('down');
        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', up);
    })
    5、getBoundClientRect函数详解

###
学习笔记
将number转为string
parseInt Object.prototype.toString()
宏任物&微任务
宏任物是传递给JavaScript引擎(传给引擎是一段JavaScript代码)的任务，微任务(只有promise会产生微任务)为引擎内部的任务。

事件循环(event loop)
JavaScript错误机制
/**
 * try catch 只能捕获运行时错误
 * const a 属于语法错误，直接在运行前被浏览器抛出
 * 语法错误通过window.error捕获。
 */
var a = 1
try {
  a = 2
  const a
} catch (err) {
  console.log('err', err)
}

隐式转换
undefined与null相等，但不恒等（===）
一个是number一个是string时，会尝试将string转换为number
隐式转换将boolean转换为number，0或1
隐式转换将Object转换成number或string，取决于另外一个对比量的类型
对于0、空字符串的判断，建议使用 “===” 。
“==”会对不同类型值进行类型转换再判断，“===”则不会。它会先判断两边的值类型，类型不匹配时直接为false。

Boxing 装箱转换
解释： 把基本数据类型转化为对应的引用数据类型的操作

每个基础类型都有一个对应的包装类，比如Number就是一个构造器，这个Number即可以使用new去调用，又可以当做一个方法直接调用，直接调用会返回一个值，如果使用new 去调用他就会返回一个 Object，我们就成这个Number对象和这个值存在一个装箱关系

js 执行粒度
宏任务 就是传给 Javascript 引擎的任务 微任务 就是 JavaScript 引擎内部的任务，只有 Promise 会产生微任务
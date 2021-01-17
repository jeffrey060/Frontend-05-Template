### 学习笔记
#### 动画的分类

- 视图动画
  - 帧动画（Frame Animation）：图片联系播放
  - 补间动画（Tween Animation）：确定开始的视图样式 & 结束的视图样式，中间动画变化过程由系统补全。
    - 平移
    - 缩放
    - 旋转
    - 透明度
- **属性动画（Property Animation）**

  - 与补间动画区别：
    - tween 只能对 View 进行增加动画，且只有 alpha、scale、translate、rotate 四种动画。属性动画可以修改任何对象。
    - 只是改变了 view 绘制的**位置**，而未改变本身，即属性没有改变。
#### js动画实现方式
- 3种方案
    -  setInterval : 比较不可控， 容易发生积压，不管动作是否执行完，都是每隔16ms执行一次
        ```js
        setInterval(()=>{}, 16)
        ```
    - setTimeout : 比setInterval好，不会产生积压, 但是指定的16ms不一定和浏览器的刷新频率一致
        ```js
        let tick=()=>{
	        setTimeout(tick, 16)
        }
        ```
    - requestAnimationFrame :  现代浏览器推荐用法, 因为它完全根据浏览器的刷新频率来执行， 不需要使用16ms的延迟，
        ```js
        let tick=()=>{
	    requestAnimationFrame(tick)
        }
        //cancelAnimationFrame
        let handler = requestAnimationFrame(tick)
        cancelAnimationFrame(handler)
        ```

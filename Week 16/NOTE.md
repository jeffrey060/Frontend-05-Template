## 手势动画应用

- **mouse 事件**
  - `mousestart` 监听在 `element` 元素上
  - `mousemove & mouseend` 监听在 `document` 上
- **touchmove & touchend:**

  - 不管你触摸屏幕后，手指是在目标元素上还是滑出目标元素， target 属性的值都不会变

#### review 一下组件项目

- **元素 layout**
  - 正常流 `inline-block` 排列轮播元素
  - 通过 `translateX ( - position * width ) ` 顺时针自动轮播
- **管理动画和时间线 animation&timeline**
  - Timeline
    - add
    - start
    - pause
    - resume
    - reset
  - Animation
    - `new Animation(object, property, startValue, endValue, delay, timingFunction, template)`
    - receiveTime
      - progress = time / duration
- **统一手势 gestrue**
  - Mouse Event: mousedown, mousemove, mouseup
  - Touch Event: touchstart, touchmove, touchup
  - 自定义手势：
    - press-start
    - press-end
    - tap
    - pan-start
    - pan-move
    - pan-end
    - flick
  - 自定义事件
    - `new Event`
    - start
    - end
- **整合动画和手势**
- **优化父子组件结构**

  - 使我们写组件时，专注于 render 方法
    - 整理函数作用域内的变量/方法
    - 细分通用变量（方法）/内部变量（方法）

- **添加状态机制**: protected
  - 私有 - symbol
  - 公有 - 挂载到 this
- **添加更多属性**

### 其他

- **继承**
  - 访问控制和继承
  - 继承类型
    - **`公有继承（public）：`**
      - 当一个类派生自**公有**基类时，
      - 基类的**公有成员**也是派生类的**公有成员**，
      - 基类的**保护成员**也是派生类的**保护成员**，
      - 基类的**私有成员**不能直接被派生类访问，但是可以通过调用基类的公有和保护成员来访问。
    - **`私有继承（private）：`**
      - 当一个类派生自**保护**基类时，
      - 基类的**公有和保护成员**将成为派生类的**保护成员**。
    - **`保护继承（protected）：`**
      - 当一个类派生自**私有**基类时，
      - 基类的**公有和保护成员**将成为派生类的**私有成员**。
- JSX 组件中的 children
  - 内容型：所见即所得
  - 模版型
   
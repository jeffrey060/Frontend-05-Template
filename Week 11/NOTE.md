学习笔记

为什么 first-letter 可以设置 float 之类的，而 first-line 不行呢？
--------------------------------------------------


float会触发重绘和重排
因为first-letter是针对字的样式不用关心变化布局所带来的影响，而first-line时必须是布局计算完成才能确定首行，
如果first-line支持改变大小或display，那么布局又需要重新计算首行很影响性能。
first-line
无法一开始就确定第一行所包含的内容，第一行的内容会在渲染最后才确定


css选择器：[https://www.w3.org/TR/selector-3]
--------------------------------------------------


selector-group: ,

selector:

1后代选择器(以空格 分隔)

2子元素选择器(以大于 > 号分隔）

3相邻兄弟选择器（以加号 + 分隔）

4普通兄弟选择器（以波浪号 ～ 分隔）

simple-selector:

1标签选择器 type

2Class 选择器 .

3Id 选择器 #

4属性选择器 []

5伪类选择器 :

6伪元素选择器
element:after  { style properties }  /* CSS2 语法 */

element::after { style properties } /_ CSS3 语法 _/

7反选伪类 :not()


css优先级
--------------------------------------------------


CSS 优先规则 1： 最近的祖先样式比其他祖先样式优先级高。
<!-- 类名为 son 的 div 的 color 为 blue -->
<div style="color: red">
  <div style="color: blue">
    <div class="son"></div>
  </div>
</div>
CSS 优先规则 2："直接样式"比"祖先样式"优先级高。
<!-- 类名为 son 的 div 的 color 为 blue -->
<div style="color: red">
  <div class="son" style="color: blue"></div>
</div>
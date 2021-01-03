学习笔记
# 学习笔记

## DTD与XML namespace
    1、XML与SGML
    http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd
    http://www.w3.org/1999/xhtml
    任何人不得在访问网页的时候访问DTD（虽然是个url，但是禁止访问）
    2、&nbsp; 不建议使用，破坏了语义
    建议使用css white-wrap
    white-space 属性设置如何处理元素内的空白。

## 合法元素

    Elemenet: <tagname>...</tagname>
    Text: text
    Comment: <!-- comments -->
    DocumentType: <!Doctype html
    ProcessingInstruction: <?a 1?>
    CDATA: <![CDATA[]]
## 字符引用
    &#160; -> 
    &amp;  -> &
    &lt;   -> <
    &quot; -> "
## 语义化标签

    <hgroup></hgroup>
    <abbr></abbr>
    <strong></strong>
    <em>重音</em>

    <figure>
    <figcaption></figcaption>
    </figure>
    <dfn></dfn>

    <samp>
    <code>
    <pre></pre>
    <code>
    </samp>

## BROWSER API
    BOM
    DOM 节点api 事件api  range api
    

    DOM API
    traversal系列，是废的，用了比不用还麻烦，不建议用

### 节点api

#### Node
    Element：元素型节点，跟标签想对应
    Document：文档根节点
    CharacterData：字符数量
    DocumentFragment：文档片段
    DocumentType:文档类型

#### 导航类操作
    parentNode parentElement
    childNodes children
    firstChild firstElementChild
    lastChild lastElementChild
    nextSibling nextElementSibling
    previousSibling previousElementSibling

#### 修改操作
    appendChild
    insertBefore
    removeChild
    replaceChild
#### 高级操作
    compareDocumentPosition 是一个用于比较两个节点中关系的函数
    contains 检查一个节点是否包含另一个节点的函数
    isEqualNode 检查两个节点是否完全相同
    isSameNode 检查两个节点是否是同一个节点，实际上在JavaScript 中可以用“===”
    cloneNode 复制一个节点，如果传入参数true，则会连同子元素做深拷贝

### 事件api
    Event：冒泡与捕获
    默认冒泡，先捕获再冒泡

### Range API：更精确，更强大

#### 一个问题：把一个元素所有的子元素逆序：12345编程54321
    考点一：知不知道DOM的collection是一个living collection，操作的时候，一操作的时候它取出来的这个集合会跟着变化
    考点二：元素的这些子元素，在insert的时候，是不需要先把它从原来的位置挪掉的，因为DOM树的性质，在进行insert操作的时候，如果它已经在DOM树上了，或者是在另一棵DOM树上这都无所谓，它一定会把把它remove下来，然后再把它append到新的树上
##### 答案1

    <div id="a">
    <span>1</span>
    <p>2</p>
    <a>3</a>
    <div>4</div>
    </div>
    let element = document.getElementById("a");
    function reverseChildren(element) {
        for(let child of children) {
        element.removeChild(child);
        }
        children.reverse();
        for(let child of children) {
        element.appendChild(child)
        }
    }
    reverseChildren(element)

##### 答案2 如果掌握了API的解法：

    let element = document.getElementById("a");
    function reverseChildren(element) {
        var l = element.childNodes.length;
        while(l-- > 0) {
        element.appendChild(element.childNodes[l])
        }
    }
    reverseChildren(element)

##### 答案3 完美的解法（用range）：
    let element = document.getElementById("a");
    function reverseChildren(element) {
        let range = new Range();
        range.selectNodeContents(element);

        let fragment = range.extractContents();
        var l = fragment.childNodes.length;
        while(l-- > 0) {
        fragment.appendChild(fragment.childNodes[l])
        }
        element.appendChild(fragment);
    }
    reverseChildren(element)


#### 创建Range

    var range = new Range()
    range.setStart(element, 9)
    range.setEnd(element, 4)
    var range = document.getSelection().getRangeAt(0)
#### 其他的一些便捷方式
    range.setStartBefore
    range.setEndBefore
    range.setStartAfter
    range.setEndAfter
    range.selectNode
    range.selectNodeContents
#### 能做什么
var fragment = range.extractContents()
range.insertNode(document.createTextNode("aaa"))
##### 案例
    <div id="a">123<span style="background-color: pink;">456789</span>0123456789</div>
    let range = new Range();
    range.setStart(document.getElementById("a").childNodes[0], 3);
    range.setEnd(document.getElementById("a").childNodes[2], 3);
    iterator 迭代器（被淘汰了）
### CSSOM
    document.styleSheets
    document.styleSheets
#### 案例
    <style title=""Hello>
        a::before {
        colorL red;
        content: "Hello"
        }
    </style>
    <link rel="stylesheet" title="x" href="data:text/css,p%7Bcolor:blue%7D">
    <a>world</a>
#### Rules
    document.styleSheets[0].cssRules
    document.styleSheets[0].insertRule("p {color:pink;}", 0)
    document.styleSheets[0].removeRule(0)
    CSSStyleRule
    selectorText String
    style K-V结构
    getComputedStyle
    window.getComputedStyle(elt, pseudoElt);
    elt 想要获取的元素
    pseudoElt 可选，伪元素
#### CSSOM View
    window
    window.innerHeight, window.innerWidth
    window.outerWidth, window.outerHeight
    window.devicePixelRatio
    window.screen
    window.screen.width
    window.screen.height
    window.screen.availWidth
    window.screen.availHeight
    Window API
    window.open("about:blank", " blank", "width=100, height=100,left=100,right=100")
    moveTo(x, y)
    moveBy(x, y)
    resizeTo(x, y)
    resizeBy(x, y)
    scroll
    scrollTop
    scrollLeft
    scrollWidth
    scrollHeight
    scroll(x, y)
    scrollBy(x, y)
    scrollIntoView()
    window
    scrollX
    scrollY
    scroll(x, y)
    scrollBy(x, y)
    layout
    getClientTects()
    getBoundingClientRect()
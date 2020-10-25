学习笔记:LL分析器是一种处理某些上下文无关文法的自顶向下分析器。首先用编程语言分词,把这些词构成层层相嵌套的语法树,然后解析.
AST(Abstract Syntax Tree) 叫做抽象语法树 构建AST的过程叫做语法分析
LL算法，LR算法,
LL算法就是从左到右扫描，从左到右规约，这样的一个缩写。
四则运算的定义
词法定义：  
TokenNumber: · 1 2 3 4 5 6 7 8 9 0 的组合  
Operator: + - * / 之一  
Whitespace: <SP>  
LineTerminator: <LF><CR>  
语法定义：
<Expression>::=  
<AdditiveExpression><EOF>
<AdditiveExpression>::=  
<MultiplicativeExpression>  
|<AdditiveExpression><+><MultiplicativeExpression>  
|<AdditiveExpression><-><MultiplicativeExpression>  
<MultiplicativeExpression>::=  
<Number>  
|<MultiplicativeExpression><*><Number>  
|<MultiplicativeExpression></><Number> 
语法分析：
对于理解"加法是由两个乘法相加的"：加法与乘法是有优先级的判定的因此我们需要有一个嵌套的关系，该嵌套最底层元单元需要是优先级高的乘法表达式。

乘法产生式： <MultiplicationExpression> ::= <Number> | <MultiplicationExpression><*><Number> | <MultiplicationExpression></><Number>
元单元一个数字也看作乘法表达式；乘法表达式加乘除运算符加数字也算作乘法表达式。

加法产生式： <AdditionExpression>::=<MultiplicationExpression>|<AdditionExpression><+><MultiplicationExpression>|<AdditionExpression><-><MultiplicationExpression>
最小单元是乘法表达式，"加法是由两个乘法相加的"。

最上层产生式： <Expression>::=<AdditionExpression><EOF>
最总向左扫描归元成一个加法产生式，eof表示总结符 end of file。


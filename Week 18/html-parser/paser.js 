const css = require('css')

const EOF = Symbol('EOF')
let currentToken = null;
let currentAttribute = null;
let currentTextNode = null;

let stack;
// css Rules
let cssRules = []
function addCssRules(content){
  let ast = css.parse(content)
  cssRules.push(...ast.stylesheet.rules)
}

function computeCss(element){
  let elements = stack.slice().reverse()
  if(!element.computedStyle){
    element.computedStyle = {}
  }
  for (const rule of cssRules) {
    // 获得选择器
    let selector = rule.selectors[0].split(' ').reverse()
    if(!match(element, selector[0])){
      continue;
    }
    let matched = false;
    let j = 1
    for(let i = 0; i < elements.length; i++){
      if(match(elements[i],selector[j])){
        j++
      }
    }
    if(j>=selector.length){
      matched = true
    }
    if(matched){
      let computedStyle = element.computedStyle
      for (const declaration of rule.declarations) {
        if(!computedStyle[declaration.property]){
          computedStyle[declaration.property] = {}
        }
        if(!computedStyle[declaration.property].specificity){
          computedStyle[declaration.property].specificity = specificity(selector)
          computedStyle[declaration.property].value = declaration.value
        } else if(compareSpecificity(computedStyle[declaration.property].specificity, specificity(selector)) < 0) {
          computedStyle[declaration.property].specificity = specificity(selector)
          computedStyle[declaration.property].value = declaration.value
        }
      }
    }
  }
}

function match(element, selector){
  if(!selector || !element.attributes){
    return false
  }
  if(selector.charAt(0) === '#'){
    let attr = element.attributes.filter(el => el.name === 'id')[0]
    if(attr && attr.value === selector.replace('#', '')){
      return true
    }
  }else if(selector[0] === '.'){
    let attr = element.attributes.filter(el => el.name === 'class')[0]
    if(attr && attr.value === selector.replace('.', '')){
      return true
    }
  }else {
    if(element.tagName === selector){
      return true
    }
  }
  return false
}

function specificity(selector){
  let p = [0,0,0,0]
  for (const s of selector) {
    if(s.charAt(0) === "#"){
      p[1] += 1
    }else if(s.charAt(0) === "."){
      p[2] += 1
    } else {
      p[3] += 1
    }
  }
  return p
}

function compareSpecificity(sp1,sp2){
  if(sp1[0] - sp2[0]){
    return sp1[0] - sp2[0]
  }else if(sp1[1] - sp2[1]){
    return sp1[1] - sp2[1]
  }else if(sp1[2] - sp2[2]){
    return sp1[2] - sp2[2]
  }else {
    return sp1[3] - sp2[3]
  }
}

// dom树构建
function emit(token){
  if(token.type === 'EOF')
    return ;
  let top = stack[stack.length - 1]
  if(token.type === 'startTag'){
    let element = {
      type: 'element',
      attributes: [],
      children: []
    }
    element.tagName = token.tagName
    for (const key in token) {
      // 获取attribute
      if(key !== 'type' && key !== 'tagName'){
        element.attributes.push({
          name: key,
          value: token[key]
        })
      }
    }
    computeCss(element)
    top.children.push(element)
    element.parent = top
    if(!token.isSelfClosing){
      stack.push(element)
    }
    currentTextNode = null
  }else if(token.type === 'text') {
    if(!currentTextNode){
      currentTextNode = {
        tagName: 'text',
        text: ""
      }
      top.children.push(currentTextNode)
    }
    currentTextNode.text += token.content;
  }else {
    if(top.tagName !== token.tagName){
      throw new Error("Tag start end doesn't match")
    }else{
      if(top.tagName === 'style'){
        addCssRules(top.children[0].text)
      }
      stack.pop();
    }
    currentTextNode = null
  }
}

// html 词法分析
function data(c){
  if(c === '<') {
    return tagOpen
  } else if(c === EOF){
    emit({
      type: 'EOF'
    })
    return ;
  }else {
    emit({
      type: 'text',
      content: c,
    })
    return data
  }
}

// 标签开始
function tagOpen(c){
  if(c.match(/^[a-zA-Z]$/)){
    currentToken = {
      type: 'startTag',
      tagName: ""
    }
    return tagName(c)
  } else if( c === '/'){
    return endTagOpen
  }else{
    emit({
      type: 'text',
      content: c,
    })
    return data;
  }
}

function tagName(c){
  if(c.match(/^[\t\f\n ]$/)){
    return beforeAttributeName(c)    
  } else if(c.match(/^[a-zA-Z0-9]$/)){
    currentToken.tagName += c
    return tagName
  } else if(c === '/'){
    return selfClosingStartTag
  }else if(c === '>') {
    emit(currentToken)
    return data
  } else {
    return tagName
  }
}

// 封闭标签
function endTagOpen(c){
  if(c.match(/^[a-zA-Z0-9]$/)){
    currentToken = {
      type: "endTag",
      tagName: ""
    }
    return tagName(c)
  }else if( c === '>'){
    // 异常
  }else if( c === EOF){
  }else{}
}

// 属性
function beforeAttributeName(c){
  if(c.match(/^[\t\n\f ]$/)){
    return beforeAttributeName
  } else if(c === '>' || c === '/' || c === EOF){
    return afterAttributeName(c)
  }else if( c === '='){
    // 异常
  }else {
    currentAttribute = {
      name: "",
      value: ""
    }
    return attributeName(c)
  }
}

function afterAttributeName(c) {
  if(c.match(/^[\t\n\f ]$/)){
    return afterAttributeName
  }else if(c === '/'){
    return selfClosingStartTag
  }else if(c === '='){
    return beforeAttributeValue;
  }else if(c === ">"){
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken)
    return data
  }else if(c === EOF){
    
  }else{
    currentToken[currentAttribute.name] = currentAttribute.value;
    currentAttribute = {
      name: '',
      value: ''
    }
    return attributeName(c)
  }
}

function attributeName(c){
  if(c.match(/^[\t\n\f ]$/) || c === '>' || c === '/' || c === EOF) {
    return afterAttributeName(c)
  } else if(c === '='){
    return beforeAttributeValue;
  } else if(c === '\u0000'){

  } else if(c === "'" || c === "\"" || c === "<" ){

  } else {
    currentAttribute.name += c
    return attributeName
  }
}

function beforeAttributeValue(c){
  if(c.match(/^[\t\n\f ]$/) || c === '>' || c === '/' || c === EOF) {
    return beforeAttributeValue
  } else if(c === "\"") {
    return doubleQuotedAttributeValue
  } else if(c === "'"){
    return singleQuotedAttributeValue
  } else if(c === ">"){

  } else {
    return unquotedAttributeValue(c)
  }
}

function doubleQuotedAttributeValue(c){
  if(c === "\""){
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if(c === '\u0000'){

  } else if(c === EOF){

  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  } 
}

function singleQuotedAttributeValue(c){
  if(c === "'"){
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if(c === '\u0000'){

  } else if(c === EOF){

  } else {
    currentAttribute.value += c;
    return singleQuotedAttributeValue;
  }
}

function unquotedAttributeValue(c){
  if(c.match(/^[\t\n\f ]$/)){
    currentToken[currentAttribute.name] = currentAttribute.value;
    return beforeAttributeName;
  } else if(c === '/'){
    currentToken[currentAttribute.name] = currentAttribute.value;
    return selfClosingStartTag
  } else if(c === '>'){
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken)
    return data
  }else if(c === '\u0000'){

  } else if(c === EOF){

  } else if(c === "'" || c === "/" || c === "="){

  }else {
    currentAttribute.value += c;
    return unquotedAttributeValue;
  }
}

function afterQuotedAttributeValue(c){
  if(c.match(/^[\t\n\f ]$/)){
    return beforeAttributeName;
  }else if(c === '/'){
    return selfClosingStartTag
  }else if(c === '>'){
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken)
    return data
  }else if(c === EOF){

  }else {
    throw new Eror("unexpect error")
  }
}

// 自封闭标签
function selfClosingStartTag(c){
  if(c === ">"){
    currentToken.isSelfClosing = true;
    emit(currentToken)
    return data
  } else if(c === EOF){

  } else {

  }
}

export function parseHtml(html){
  stack  = [{
    type: "document",
    children: []
  }]
 currentToken = null;
 currentAttribute = null;
 currentTextNode = null;

  let state = data
  for (const c of html) {
    state = state(c)
  }
  state(EOF)
  return stack[0]
}
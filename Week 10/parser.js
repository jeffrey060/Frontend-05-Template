const layout = require('./layout');
const css = require('css');

let currentToken = null;
let currentAttribute = null;

let stack = [{ type: 'document', children: [] }];

let rules = [];
function addCSSRules(cssText) {
  const ast = css.parse(cssText);
  // console.log(JSON.stringify(ast, null, '  '));
  rules.push(...ast.stylesheet.rules);
}

function match(element, selector) {
  if (!selector || !(element.attributes.length >= 0)) return;

  if (selector.charAt(0) === '#') {
    // id 选择器
    // 过滤出id属性
    const attr = element.attributes.filter((a) => a.name === 'id')[0];
    // 判断属性值相等
    if (attr && attr.value === selector.replace('#', '')) {
      return true;
    }
  } else if (selector.charAt(0) === '.') {
    // class
    const attr = element.attributes.filter((a) => a.name === 'class')[0];
    if (attr && attr.value === selector.replace('.', '')) {
      return true;
    }
  } else if (element.tagName === selector) {
    // 标签选择器
    return true;
  }
  return false;
}

function specificity(selector) {
  const p = [0, 0, 0, 0]; // [inline, id, class, tag]
  const selectorParts = selector.split(' ');
  for (const part of selectorParts) {
    if (part.charAt(0) === '#') {
      p[1] += 1;
    } else if (part.charAt(0) === '.') {
      p[2] += 1;
    } else {
      p[3] += 1;
    }
  }
  return p;
}

function compare(sp1, sp2) {
  // [0, 0, 0, 0]
  // 比较, 不等就返回
  if (sp1[0] - sp2[0]) {
    return sp1[0] - sp2[0];
  } else if (sp1[1] - sp2[1]) {
    return sp1[1] - sp2[1];
  } else if (sp1[2] - sp2[2]) {
    return sp1[2] - sp2[2];
  }
  return sp1[3] - sp2[3];
}

function computeCSS(element) {
  // console.log('rules:', rules);
  // console.log('compute CSS for Element', element);
  // 选择器匹配规则：从内层往外层匹配
  const elements = stack.slice().reverse();
  if (!element.computedStyle) {
    // 保存css属性
    element.computedStyle = {};
  }

  for (const rule of rules) {
    // 复合选择器数组，内 => 外
    const selectorParts = rule.selectors[0].split(' ').reverse();

    if (!match(element, selectorParts[0])) continue;

    let matched = false;

    let j = 1;
    for (let i = 0; i < elements.length; i++) {
      if (match(elements[i], selectorParts[j])) {
        j++;
      }
    }

    if (j >= selectorParts.length) matched = true;

    if (matched) {
      // console.log('Element', element, 'matched rule', rule);
      const computedStyle = element.computedStyle;
      const sp = specificity(rule.selectors[0]);
      for (const declaration of rule.declarations) {
        if (!computedStyle[declaration.property]) {
          computedStyle[declaration.property] = {};
        }

        if (!computedStyle[declaration.property].specificity) {
          computedStyle[declaration.property].value = declaration.value;
          computedStyle[declaration.property].specificity = sp;
        } else if (compare(computedStyle[declaration.property].specificity, sp) < 0) {
          // 如果新的层级高,覆盖,反之,不用处理
          computedStyle[declaration.property].value = declaration.value;
          computedStyle[declaration.property].specificity = sp;
        }
      }

      // console.log('element.computedStyle:', element.computedStyle);
    }
  }
}

function emit(token) {
  // console.log('token:', token);
  const top = stack[stack.length - 1];
  let currentTextNode = null;
  if (token.type === 'text') {
    currentTextNode = {
      type: 'text',
      content: '',
    };
    top.children.push(currentTextNode);
    currentTextNode.content += token.content;
  }
  if (token.type === 'startTag') {
    let element = {
      type: 'element',
      tagName: '',
      children: [],
      attributes: [],
      parent: null,
    };
    element.tagName = token.tagName;
    for (const p in token) {
      element.attributes.push({
        name: p,
        value: token[p],
      });
    }

    computeCSS(element);

    top.children.push(element);
    element.parent = top;

    // 至于最顶层
    if (!token.isSelfClosing) {
      stack.push(element);
    }

    currentTextNode = null;
  }
  if (token.type === 'endTag') {
    if (top.tagName === token.tagName) {
      if (token.tagName === 'style') {
        const cssText = top.children.map((i) => i.content).join('');
        addCSSRules(cssText);
      }

      layout(top);
      stack.pop();
    }

    currentTextNode = null;
  }
}

const EOF = Symbol('EOF'); // EOF: End Of File.

function data(c) {
  if (c === '<') {
    // '<div' ------ '<'
    return tagOpen;
  } else if (c === EOF) {
    emit({ type: 'EOF' });
    return;
  } else {
    emit({
      type: 'text',
      content: c,
    });
    return data;
  }
}

function tagOpen(c) {
  if (c === '/') {
    // </div ------- </
    return endTagOpen;
  } else if (c.match(/^[a-zA-Z]$/)) {
    // <div -------- div
    currentToken = {
      type: 'startTag',
      tagName: '',
    };
    return tagName(c);
  } else {
    // 文档节点 !
    return;
  }
}

function endTagOpen(c) {
  if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'endTag',
      tagName: '',
    };
    return tagName(c);
  } else if (c === '>') {
  } else if (c === EOF) {
  } else {
    return;
  }
}

function tagName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    // 标签属性
    return beforeAttributeName;
  } else if (c === '/') {
    // 字母后面紧接 /
    return selfClosingStartTag;
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken.tagName += c;
    return tagName;
  } else if (c === '>') {
    emit(currentToken);
    return data;
  } else {
    // 疑问
    return tagName;
  }
}

function beforeAttributeName(c) {
  // charset="UTF-8">
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c === '>' || c === '/' || c === EOF) {
    return afterAttributeName(c);
  } else if (c === '=') {
    // 属性名第一位 = ，抛错
  } else {
    currentAttribute = {
      name: '',
      value: '',
    };
    return attributeName(c);
  }
}

function afterAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return afterAttributeName;
  } else if (c === '/') {
    return singleQuotedAttributeValue;
  } else if (c === '=') {
    return beforeAttributeValue;
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c === EOF) {
  } else {
    currentToken[currentAttribute.name] = currentAttribute.value;
    currentAttribute = {
      name: '',
      value: '',
    };
    return attributeName(c);
  }
}

function attributeName(c) {
  if (c.match(/^[\t\n\f ]$/ || c === '/' || c === '>' || c === EOF)) {
    // 属性结束
    return afterAttributeName(c);
  } else if (c === '=') {
    return beforeAttributeValue;
  } else if (c === '\u0000') {
    // 空字符
  } else if (c === "'" || c === '"' || c === '<') {
  } else {
    currentAttribute.name += c;
    return attributeName;
  }
}

function beforeAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/) || c === '/' || c === '>' || c === EOF) {
    return afterAttributeName;
  } else if (c === '"') {
    return doubleQuotedAttributeValue;
  } else if (c === "'") {
    return singleQuotedAttributeValue;
  } else if (c === '>') {
  } else {
    return unQuotedAttributeValue(c);
  }
}

function doubleQuotedAttributeValue(c) {
  if (c === '"') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (c === '\u0000') {
  } else if (c === EOF) {
  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}

function singleQuotedAttributeValue(c) {
  if (c === "'") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (c === '\u0000') {
  } else if (c === EOF) {
  } else {
    currentAttribute.value += c;
    return singleQuotedAttributeValue;
  }
}

function unQuotedAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return beforeAttributeName;
  } else if (c === '/') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return selfClosingStartTag;
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c === '\u0000') {
  } else if (c === '"' || c === "'" || c === '<' || c === '=' || c === '`' || c === EOF) {
  } else {
    currentAttribute.value += c;
    return unQuotedAttributeValue;
  }
}

function afterQuotedAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c === '/') {
    return selfClosingStartTag;
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c === EOF) {
  } else {
    currentAttribute.value += c;
    return afterQuotedAttributeValue;
  }
}

function selfClosingStartTag(c) {
  if (c === '>') {
    currentToken.isSelfClosing = true;
    return data;
  } else if (c === EOF) {
  } else {
  }
}

/**
 *
 * @param {string} html
 * <html></html> 开始标签、结束标签
 * <img/> 自封闭标签
 */
module.exports.parserHtml = function parserHtml(html) {
  let state = data;
  for (const c of html) {
    state = state(c);
  }
  state = state(EOF);
  // console.log('stack:', stack);
  return stack[0];
};

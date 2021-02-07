import {parseHtml} from '../src/paser.js';

var assert = require('assert');

describe('parse html:', function() {
  it('<a></a>', function(){
    let tree = parseHtml('<a></a>')
    assert.strictEqual(tree.children[0].tagName, "a");
    assert.strictEqual(tree.children[0].children.length, 0);
  })
  it('<a href="//time.geekbang.org"></a>', function(){
    let tree = parseHtml('<a href="//time.geekbang.org"></a>')
    assert.strictEqual(tree.children.length, 1);
    assert.strictEqual(tree.children[0].children.length, 0);
  })
  it('<a href ></a>', function(){
    let tree = parseHtml('<a href ></a>')
    assert.strictEqual(tree.children.length, 1);
    assert.strictEqual(tree.children[0].children.length, 0);
  })
  it('<a href id ></a>', function(){
    let tree = parseHtml('<a href id ></a>')
    assert.strictEqual(tree.children.length, 1);
    assert.strictEqual(tree.children[0].children.length, 0);
  })
  it(`<a href="abc" id ></a>`, function(){
    let tree = parseHtml(`<a href="abc" id ></a>`)
    assert.strictEqual(tree.children.length, 1);
    assert.strictEqual(tree.children[0].children.length, 0);
  })
  it("<a id=abc ></a>", function(){
    let tree = parseHtml("<a id=abc ></a>")
    assert.strictEqual(tree.children.length, 1);
    assert.strictEqual(tree.children[0].children.length, 0);
  })
  it("<a id=abc />", function(){
    let tree = parseHtml("<a id=abc />")
    assert.strictEqual(tree.children.length, 1);
    assert.strictEqual(tree.children[0].children.length, 0);
  })
  it(`<a id=\'abc\ ' />`, function(){
    let tree = parseHtml("<a id=\'abc\ ' />")
    assert.strictEqual(tree.children.length, 1);
    assert.strictEqual(tree.children[0].children.length, 0);
  })
  it(`<a />`, function(){
    let tree = parseHtml(`<a />`)
    assert.strictEqual(tree.children.length, 1);
    assert.strictEqual(tree.children[0].children.length, 0);
  })
  it(`<A />`, function(){
    let tree = parseHtml(`<A />`)
    assert.strictEqual(tree.children.length, 1);
    assert.strictEqual(tree.children[0].children.length, 0);
  })
  it(`<>`, function(){
    let tree = parseHtml(`<>`)
    assert.strictEqual(tree.children.length, 1);
    assert.strictEqual(tree.children.type, "text");
  })
})
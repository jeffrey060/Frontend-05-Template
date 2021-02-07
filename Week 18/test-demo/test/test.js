import add from '../add';

var assert = require('assert');

describe('add function testing', function() {
  it('2+2 should be 4', function(){
    assert.equal(add(2,2), 4)
  })

  it('-6+2 should be -4', function(){
    assert.equal(add(-6,2), -4)
  })
})
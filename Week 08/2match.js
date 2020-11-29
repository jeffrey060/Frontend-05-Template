//  寻找 字符串 'ab'
function match(str) {
      let tag = false;
      for (const item of str) {
          if (item === 'a') {
              tag = true;
          } else if (tag && item === 'b') {
              return true;
          } else {
              tag = false;
          }
      }
      return false
  }
  
  let result = match('I abm groot');
  console.log(result);
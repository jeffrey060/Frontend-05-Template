//  寻找 字符串 'abcdef'
function match(str) {
      let tagA = false, tagB = false,tagC = false,tagD = false,tagE = false;
      for (const item of str) {
          if (item === 'a') {
              tagA = true;
          } else if (tagA && item === 'b') {
              tagB = true
          } else if (tagB && item === 'c') {
              tagC = true
          } else if (tagC && item === 'd') {
              tagD = true
          } else if (tagD && item === 'e') {
              tagE = true
          } else if (tagE && item === 'f') {
              return true
          } else {
              tagA = true;
              tagB = true;
              tagC = true;
              tagD = true;
              tagE = true;
          }
      }
      return false
  }
  
  let result = match('I abcdef groot');
  console.log(result);
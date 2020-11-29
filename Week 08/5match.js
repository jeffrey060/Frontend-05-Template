
//寻找 abcabx
function match(string) {
      let state = start;
      for (const item of string) {
          state = state(item);
      }
      return state === end;
  }
  
  function start(val) {
      if (val === 'a') {
          return foundA;
      } else {
          return start;
      }
  }
  
  function end(val) {
      return end;
  }
  
  function foundA(val) {
      if (val === 'b') {
          return foundB;
      } else {
          return start(val);
      }
  }
  
  function foundB(val) {
      if (val === 'c') {
          return foundC;
      } else {
          return start(val);
      }
  }
  
  function foundC(val) {
      if (val === 'a') {
          return foundA2;
      } else {
          return start(val);
      }
  }
  
  function foundA2(val) {
      if (val === 'b') {
          return foundB2;
      } else {
          return start(val);
      }
  }
  
  function foundB2(val) {
      if (val === 'x') {
          return end;
      } else {
          return foundB(val)
      }
  }
  
  let result = match('I mabcabxgrood');
  
  console.log(result);
  
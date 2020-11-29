
function match(string) {
      let state = start;
      for (const item of string) {
          state = state(item);
      }
      return state === end;
  }
  
  function end(val) {
      return end;
  }
  
  function start(val) {
      if (val === 'a') {
          return foundA;
      } else {
          return start;
      }
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
      if (val === 'd') {
          return foundD;
      } else {
          return start(val);
      }
  }
  function foundD(val) {
      if (val === 'e') {
          return foundE;
      } else {
          return start(val);
      }
  }
  function foundE(val) {
      if (val === 'f') {
          return end;
      } else {
          return start(val);
      }
  }
  
  let result = match('I mabcabcdefgroot');
  
  console.log(result);
  
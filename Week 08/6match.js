//寻找 abababx
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
      if (val === 'a') {
          return foundA3;
      } else {
          return start(val);
      }
  }
  
  function foundA3(val) {
      if (val === 'b') {
          return foundB3;
      } else {
          return start(val);
      }
  }
  
  function foundB3(val) {
      if (val === 'x') {
          return end;
      } else {
          return foundB2(val);
      }
  }
  
  
  let result = match('I mababababxgrood');
  
  console.log(result);
  
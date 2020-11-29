function match(str) {
      for (const item of str) {
          if (item === 'a') return true;
      }
      return false;
  }
  match('absd')
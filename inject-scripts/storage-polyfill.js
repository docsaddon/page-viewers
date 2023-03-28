// Chrome Iframe 隐私政策，在禁用第三方 cookie 时，从 window 上获取 storage 会报错
(function() {
  function getFakeStorage() {
    var fakeStorage = {
      map: new Map(),
      clear() {
        fakeStorage.length = 0;
        return fakeStorage.map.clear();
      },
      setItem(k, v) {
        fakeStorage.map.set(k, v);
        fakeStorage.length++;
      },
      getItem(k) {
        return fakeStorage.map.get(k);
      },
      removeItem(k) {
        fakeStorage.map.delete(k);
        fakeStorage.length--;
      },
      key(index) {
        const keys = Array.from(fakeStorage.map.keys());
        return keys[index] || '';
      },
      length: 0,
    };
    return fakeStorage;
  }

  var fakeLocalStorage = getFakeStorage();
  var fakeSessionStorage = getFakeStorage();

  try {
    console.log(window.localStorage.length);
  } catch (err) {
    Object.defineProperty(window, 'localStorage', {
      get: function() { return fakeLocalStorage; },
    });
    Object.defineProperty(window, 'sessionStorage', {
      get: function() { return fakeSessionStorage; },
    });
  }
})();

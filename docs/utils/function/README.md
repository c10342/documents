# 函数相关

## call 函数

```javascript
function call(fn, obj, ...args) {
  if (obj === undefined || obj === null) {
    // globalThis  es11
    obj = globalThis;
  }
  obj.temp = fn;
  const result = obj.temp(...args);
  delete obj.temp;
  return result;
}
function add(a, b) {
  const result = a + b + this.c;
  console.log(result);
}
const obj = { c: 3 };
window.c = 3;
call(add, obj, 1, 2);
call(add, null, 1, 2);
```

## apply 函数

```javascript
function apply(fn, obj, args) {
  if (obj === undefined || obj === null) {
    // globalThis  es11
    obj = globalThis;
  }
  obj.temp = fn;
  const result = obj.temp(...args);
  delete obj.temp;
  return result;
}
function add(a, b) {
  const result = a + b + this.c;
  console.log(result);
}
const obj = { c: 3 };
window.c = 3;
apply(add, obj, [1, 2]);
apply(add, null, [1, 2]);
```

## bind 函数

```javascript
function bind(fn, obj, ...args1) {
  return function(...args2) {
    if (obj === undefined || obj === null) {
      // globalThis  es11
      obj = globalThis;
    }
    obj.temp = fn;
    const result = obj.temp(...args1, ...args2);
    delete obj.temp;
    return result;
  };
}
function add(a, b) {
  const result = a + b + this.c;
  console.log(result);
}
const obj = { c: 3 };
window.c = 3;
bind(add, obj, 1)(2);
bind(add, null)(1, 2);
```

## throttle 节流

在单位时间内最多执行一次

```javascript
function throttle(callback, wait) {
  let startTime = Date.now();
  return function(event) {
    let endTime = Date.now();
    if (endTime - startTime > wait) {
      callback.call(this, event);
      startTime = endTime;
    }
  };
}
window.addEventListener(
  "scroll",
  throttle(function(event) {
    console.log(event);
  }, 500)
);
```

## debounce 防抖

延迟执行

```javascript
function debounce(callback, wait) {
  let timeID = null;
  return function(event) {
    if (timeID !== null) {
      clearTimeout(timeID);
    }
    timeID = setTimeout(() => {
      callback.call(this, event);
      timeID = null;
    }, wait);
  };
}
const input = document.getElementById("input");
input.addEventListener(
  "input",
  debounce(function(event) {
    console.log(event.target.value);
  }, 500)
);
```

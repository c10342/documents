# 函数相关

## call 函数

### 第一种

```javascript
function call(fn, obj, ...args) {
  if (obj === undefined || obj === null) {
    // globalThis  es11
    obj = globalThis;
  } else {
    // xxx.fn 谁调用this就指向谁，所以要把方法挂载到context上，但是context可能会是个字符串，字符串不能直接挂在方法，所以需要将字符串变成对象
    obj = obj ? Object(obj) : globalThis;
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

### 第二种

```javascript
function fn1() {
  console.log(this, arguments);
}

function fn2() {
  console.log(2);
}

Function.prototype.call = function(context) {
  // xxx.fn 谁调用this就指向谁，所以要把方法挂载到context上，但是context可能会是个字符串，字符串不能直接挂在方法，所以需要将字符串变成对象
  context = context ? Object(context) : window;

  context.fn = this;

  let args = [];

  for (let i = 1; i < arguments.length; i++) {
    args.push(`arguments[${i}]`);
  }
  // 利用数组的toString特征 --> context.fn(arguments[1],arguments[2])
  let fnstr = `context.fn(${args})`;
  let r = eval(fnstr);
  delete context.fn;
  return r;
};

// String {"hello", fn: ƒ} Arguments(2) [1, 2, callee: ƒ, Symbol(Symbol.iterator): ƒ]
fn1.call("hello", 1, 2);

// 2
fn1.call.call(fn2);
```

## apply 函数

```javascript
function apply(fn, obj, args) {
  if (obj === undefined || obj === null) {
    // globalThis  es11
    obj = globalThis;
  } else {
    // xxx.fn 谁调用this就指向谁，所以要把方法挂载到context上，但是context可能会是个字符串，字符串不能直接挂在方法，所以需要将字符串变成对象
    obj = obj ? Object(obj) : globalThis;
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

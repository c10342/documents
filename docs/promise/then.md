# then 方法执行回调

## 同步情况

```javascript
Promise.prototype.then = function(onResolved, onRejected) {
  // 根据不同状态去调用onResolved和onRejected
  if (this.promiseState === FULFILLED && typeof onResolved === "function") {
    onResolved(this.promiseResult);
  }
  if (this.promiseState === REJECTED && typeof onRejected === "function") {
    onRejected(this.promiseResult);
  }
};
```

## 异步情况

```javascript
function Promise(executor) {
  // 保存then回调函数
  this.callback = {};
  // promise状态
  this.promiseState = PEDDING;
  // promise结果值
  this.promiseResult = null;
  const resolve = data => {
    // ...
    // 异步任务的情况
    if (this.callback.onResolved) {
      this.callback.onResolved(data);
    }
  };
  const reject = data => {
    // ...
    // 异步任务的情况
    if (this.callback.onRejected) {
      this.callback.onRejected(data);
    }
  };
  // ...
}

Promise.prototype.then = function(onResolved, onRejected) {
  // ...
  if (this.promiseState === PEDDING) {
    // Promise里面的代码是异步的情况
    this.callback = {
      onRejected,
      onResolved
    };
  }
};
```

## 多个 then 回调

```javascript
function Promise(executor) {
  // 保存then回调函数
  this.callbacks = [];
  // promise状态
  this.promiseState = PEDDING;
  // promise结果值
  this.promiseResult = null;
  const resolve = data => {
    // ...
    // 异步任务的情况
    this.callbacks.forEach(item => {
      if (typeof item.onResolved === "function") {
        item.onResolved(data);
      }
    });
  };
  const reject = data => {
    // ...
    // 异步任务的情况
    this.callbacks.forEach(item => {
      if (typeof item.onRejected === "function") {
        item.onRejected(data);
      }
    });
  };
  // ...
}

Promise.prototype.then = function(onResolved, onRejected) {
  if (this.promiseState === PEDDING) {
    // Promise里面的代码是异步的情况
    this.callbacks.push({
      onRejected,
      onResolved
    });
  }
};

const p = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject("OK");
  }, 1000);
});
p.then(
  value => {
    console.log(value);
  },
  error => {
    console.warn(error);
  }
);
p.then(
  value => {
    alert(value);
  },
  error => {
    alert(error);
  }
);
```

## 同步修改状态 then 方法返回结果

then 方法返回的是一个 promise 对象，但是这个 promise 对象的状态是由 onResolved 或者 onRejected 的返回值决定的，如果 onResolved 或者 onRejected 的返回值是一个 Promise，则 promise 对象由返回的 Promise 决定，否则就是成功

```javascript
Promise.prototype.then = function(onResolved, onRejected) {
  return new Promise((resolve, reject) => {
    // 根据不同状态去调用onResolved和onRejected
    if (this.promiseState === FULFILLED && typeof onResolved === "function") {
      // onResolved执行的时候抛出错误则直接reject
      try {
        // Promise里面的代码是同步情况下就会执行这里

        // 获取onResolved执行返回结果
        const result = onResolved(this.promiseResult);
        if (result instanceof Promise) {
          result.then(
            v => {
              resolve(v);
            },
            r => {
              reject(r);
            }
          );
        } else {
          resolve(result);
        }
      } catch (error) {
        reject(error);
      }
    }
  });
};

const res = p.then(
  value => {
    console.log(value);
    // return new Promise((resolve,reject)=>{
    //     reject('hello')
    // })
    return "12";
  },
  error => {
    console.warn(error);
  }
);
console.log(res);
```

## 异步修改状态 then 方法返回结果

```javascript
Promise.prototype.then = function(onResolved, onRejected) {
  return new Promise((resolve, reject) => {
    const self = this;
    if (this.promiseState === PEDDING) {
      // Promise里面的代码是异步的情况
      this.callbacks.push({
        onRejected() {
          try {
            const result = onRejected(self.promiseResult);
            if (result instanceof Promise) {
              result.then(
                v => resolve(v),
                r => reject(r)
              );
            } else {
              resolve(result);
            }
          } catch (error) {
            reject(error);
          }
        },
        onResolved() {
          // ...
        }
      });
    }
  });
};
```

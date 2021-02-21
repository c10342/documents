# 完整代码

```javascript
const PEDDING = "pedding";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

function Promise(executor) {
  // 保存then回调函数
  this.callbacks = [];
  // promise状态
  this.promiseState = PEDDING;
  // promise结果值
  this.promiseResult = null;
  const resolve = (data) => {
    // 状态只能修改一次
    if (this.promiseState !== PEDDING) return;
    this.promiseState = FULFILLED;
    this.promiseResult = data;
    // 异步任务的情况
    setTimeout(() => {
      this.callbacks.forEach((item) => {
        item.onResolved(data);
      });
    });
  };
  const reject = (data) => {
    // 状态只能修改一次
    if (this.promiseState !== PEDDING) return;
    // 改变状态
    this.promiseState = REJECTED;
    // 设置结果值
    this.promiseResult = data;
    // 异步任务的情况
    setTimeout(() => {
      this.callbacks.forEach((item) => {
        item.onRejected(data);
      });
    });
  };
  try {
    executor(resolve, reject);
  } catch (error) {
    reject(error);
  }
}

// then方法返回的是一个promise对象，
// 但是这个promise对象的状态是由onResolved或者onRejected的返回值决定的，
// 如果onResolved或者onRejected的返回值是一个Promise，则promise对象由返回的Promise决定，
// 否则就是成功
Promise.prototype.then = function(onResolved, onRejected) {
  return new Promise((resolve, reject) => {
    // 当onResolved没有传的时候需要给一个默认值，此时如果then不给任何参数也能进行值传递
    onResolved =
      typeof onResolved === "function" ? onResolved : (value) => value;
    // 当onResolved没有传的时候需要给一个默认值，此时才能进行异常穿透
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (error) => {
            throw error;
          };
    const self = this;
    function handlerCallback(fn) {
      // 执行的时候抛出错误则直接reject
      try {
        const result = fn(self.promiseResult);
        if (result instanceof Promise) {
          result.then(
            (v) => {
              resolve(v);
            },
            (r) => {
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
    // 根据不同状态去调用onResolved和onRejected
    if (this.promiseState === FULFILLED) {
      setTimeout(() => {
        handlerCallback(onResolved);
      });
    }
    if (this.promiseState === REJECTED) {
      // Promise里面的代码是同步情况下就会执行这里
      setTimeout(() => {
        handlerCallback(onRejected);
      });
    }
    if (this.promiseState === PEDDING) {
      // Promise里面的代码是异步的情况
      this.callbacks.push({
        onRejected() {
          handlerCallback(onRejected);
        },
        onResolved() {
          handlerCallback(onResolved);
        },
      });
    }
  });
};
Promise.prototype.catch = function(onRejected) {
  return this.then(undefined, onRejected);
};

// Promise.resolve返回的是一个promise实例
// 其状态由传入的值决定，
// 如果传入的值为非promise，则其状态为成功的，且值为传递进来的值；
// 如果传入进来的值为promise，则其状态由传入的promise的值决定
Promise.resolve = function(value) {
  return new Promise((resolve, reject) => {
    try {
      if (value instanceof Promise) {
        value.then(
          (v) => resolve(v),
          (r) => reject(r)
        );
      } else {
        resolve(value);
      }
    } catch (error) {
      reject(error);
    }
  });
};

// 该方法无论传入什么，其状态都是失败
Promise.reject = function(value) {
  return new Promise((resolve, reject) => {
    reject(value);
  });
};

// 该方法需要传入一个promise数组，并且所有状态为成功，才能为成功，有一个失败则为失败
Promise.all = function(promiseList) {
  return new Promise((resolve, reject) => {
    let count = 0;
    let resultArr = [];
    for (let i = 0; i < promiseList.length; i++) {
      promiseList[i].then(
        (value) => {
          count++;
          resultArr[i] = value;
          if (count === promiseList.length) {
            resolve(resultArr);
          }
        },
        (error) => {
          reject(error);
        }
      );
    }
  });
};

// 该方法需要传入一个promise数组，先执行完毕的promise状态决定了该方法返回的promise状态
Promise.race = function(promiseList) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promiseList.length; i++) {
      promiseList[i].then(
        (value) => {
          resolve(value);
        },
        (error) => {
          reject(error);
        }
      );
    }
  });
};
```

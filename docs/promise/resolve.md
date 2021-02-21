# Promise.resolve 方法封装

- Promise.resolve 返回的是一个 promise 实例
- 其状态由传入的值决定
  - 如果传入的值为非 promise，则其状态为成功的，且值为传递进来的值
  - 如果传入进来的值为 promise，则其状态由传入的 promise 的值决定

```javascript
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
```

# Promise.race 方法封装

- 该方法需要传入一个 promise 数组，先执行完毕的 promise 状态决定了该方法返回的 promise 状态

```javascript
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

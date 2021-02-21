# Promise.all 方法封装

- 该方法需要传入一个 promise 数组，并且所有状态为成功，才能为成功，有一个失败则为失败

```javascript
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
```

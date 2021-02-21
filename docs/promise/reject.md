# Promise.reject 方法封装

-该方法无论传入什么，其状态都是失败

```javascript
Promise.reject = function(value) {
  return new Promise((resolve, reject) => {
    reject(value);
  });
};
```

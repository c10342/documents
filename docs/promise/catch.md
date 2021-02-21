# catch 方法-异常传递和值传递

```javascript
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
    // ...
  });
};
Promise.prototype.catch = function(onRejected) {
  return this.then(undefined, onRejected);
};

const p = new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve('OK')
    },1000)
    
})

const res = p.then(value=>{
   console.log(111);
}).then(value=>{
    console.log(222);
}).then(value=>{
    console.log(333);
}).catch(error=>{
    console.warn(error);
})
```

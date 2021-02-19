# throw抛出异常改变状态

```javascript
function Promise(executor){
    const resolve = data=>{
        // ...
    }
    const reject = data=>{
        // ...
    }
    try {
        executor(resolve,reject)
    } catch (error) {
        reject(error)
    }
}
```
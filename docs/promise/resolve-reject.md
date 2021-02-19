# resolve 与 reject 代码实现

```javascript
const PEDDING = "pedding";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

function Promise(executor) {
  // promise状态
  this.promiseState = PEDDING;
  // promise结果值
  this.promiseResult = null;
  const resolve = data => {
    // 状态只能修改一次
    if (this.promiseState !== PEDDING) return;
    this.promiseState = FULFILLED;
    this.promiseResult = data;
  };
  const reject = data => {
    // 状态只能修改一次
    if (this.promiseState !== PEDDING) return;
    // 改变状态
    this.promiseState = REJECTED;
    // 设置结果值
    this.promiseResult = data;
  };
  executor(resolve, reject);
}
```

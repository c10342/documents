# 事件总线

```javascript
const eventBus = {
  callback: {}
};

eventBus.on = function(eventName, callback) {
  if (!eventName || typeof callback !== "function") {
    return;
  }
  if (this.callback.hasOwnProperty(eventName)) {
    this.callback[eventName].push(callback);
  } else {
    this.callback[eventName] = [callback];
  }
};

eventBus.emit = function(eventName, data) {
  if (!eventName) {
    return;
  }
  const callback = this.callback;
  if (callback.hasOwnProperty(eventName)) {
    callback[eventName].forEach(fn => fn(data));
  }
};

eventBus.off = function(eventName, callback) {
  if (eventName) {
    if (this.callback.hasOwnProperty(eventName)) {
      if (callback) {
        const index = this.callback[eventName].findIndex(fn => fn === callback);
        if (index > -1) {
          this.callback[eventName].splice(index, 1);
        }
      } else {
        delete this.callback[eventName];
      }
    }
  } else {
    this.callback = {};
  }
};
```

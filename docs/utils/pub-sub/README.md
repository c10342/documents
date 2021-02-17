# 发布订阅

```javascript
const PubSub = {
  id: 0,
  callbacks: {}
};

PubSub.subscribe = function(channel, callback) {
  if (!channel || typeof callback !== "function") {
    return;
  }
  const token = `token_${this.id++}`;
  if (this.callbacks[channel]) {
    this.callbacks[channel][token] = callback;
  } else {
    this.callbacks[channel] = {
      [token]: callback
    };
  }
  return token;
};

PubSub.publish = function(channel, data) {
  if (!channel) {
    return;
  }
  const callback = this.callbacks[channel];
  if (callback) {
    Object.values(callback).forEach(fn => fn(data));
  }
};
PubSub.unSubscribe = function(channel, token) {
  if (!channel && !token) {
    this.callbacks = {};
  } else if (channel && !token) {
    if (this.callbacks[channel]) {
      delete this.callbacks[channel];
    }
  } else if (channel && token) {
    if (this.callbacks[channel]) {
      delete this.callbacks[channel][token];
    }
  }
};
```

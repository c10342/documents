# axios 拦截器

```javascript
function InterceptorManage() {
  this.handlers = [];
}

InterceptorManage.prototype.use = function(fulfilled, rejected) {
  this.handlers.push({
    fulfilled,
    rejected
  });
};
function Axios(defaultConfig) {
  // 默认配置
  this.defaultConfig = defaultConfig;
  this.interceptor = {
    request: new InterceptorManage(),
    response: new InterceptorManage()
  };
}

Axios.prototype.request = function(config = {}) {
  let promise = Promise.resolve(config);
  // undefined是用来占位的
  const chain = [dispatchRequest, undefined];
  this.interceptor.request.handlers.forEach(handler => {
    chain.unshift(handler.fulfilled, handler.rejected);
  });
  this.interceptor.response.handlers.forEach(handler => {
    chain.push(handler.fulfilled, handler.rejected);
  });
  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }
  return promise;
};

function dispatchRequest(config) {
  return xhrAdapter(config)
    .then(res => {
      // 此处格式化返回来的数据
      // ...
      return res;
    })
    .catch(error => {
      throw error;
    });
}
function xhrAdapter(config) {
  return new Promise((resolve, reject) => {
    resolve({
      status: 200,
      message: "ok"
    });
  });
}

function createInstance(config = {}) {
  const context = new Axios(config);
  const instance = Axios.prototype.request.bind(context);
  Object.keys(context).forEach(key => {
    instance[key] = context[key];
  });
  return instance;
}
```

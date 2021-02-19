# axios 对象创建过程

```javascript
function Axios(defaultConfig) {
  // 默认配置
  this.defaultConfig = defaultConfig;
  // 拦截器
  this.interceptor = {
    request: {},
    respond: {}
  };
}

Axios.prototype.request = function(config = {}) {
  console.log("发送请求:" + config.method + "请求");
};
Axios.prototype.get = function(config = {}) {
  return this.request({
    method: "GET",
    ...config
  });
};
Axios.prototype.post = function(config = {}) {
  return this.request({
    method: "POST",
    ...config
  });
};

function createInstance(config) {
  const context = new Axios(config);
  // 创建请求函数
  const instance = Axios.prototype.request.bind(context);

  // 将Axios.prototype中的get，post等方法挂载到instance请求函数中
  Object.keys(Axios.prototype).forEach(key => {
    instance[key] = Axios.prototype[key].bind(context);
  });
  // 将context中的defaultConfig和interceptor挂在到instance请求函数中
  Object.keys(context).forEach(key => {
    instance[key] = context[key];
  });
  return instance;
}

const axios = createInstance();
```

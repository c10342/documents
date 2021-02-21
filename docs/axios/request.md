# axios 请求过程

- `dispatchRequest`函数选择合适的适配器去发送请求，web端或者node端

```javascript
function Axios(defaultConfig) {
  // 默认配置
  this.defaultConfig = defaultConfig;
}

Axios.prototype.request = function(config = {}) {
  console.log("发送请求:" + config.method + "请求");
  const promise = Promise.resolve(config);
  // undefined是用来占位的，拦截器会用到
  const chain = [dispatchRequest, undefined];
  const result = promise.then(chain[0], chain[1]);
  return result;
};

function dispatchRequest(config) {
  // 调用适配器发送请求，调用浏览器端的或者node端的
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
    const xhr = new XMLHttpRequest();
    xhr.open(config.method.toUpperCase(), config.url);
    xhr.send();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({
            config,
            data: xhr.responseText,
            headers: xhr.getAllResponseHeaders(),
            request: xhr,
            status: xhr.status,
            statusText: xhr.statusText
          });
        } else {
          reject(new Error(`请求失败，失败状态码为${xhr.status}`));
        }
      }
    };
  });
}

function createInstance(config) {
  const context = new Axios(config);
  const instance = Axios.prototype.request.bind(context);
  return instance;
}

const axios = createInstance();

axios({
  method: "get",
  url: "https://cnodejs.org/api/v1/topics"
})
  .then(res => {
    console.log("请求成功", res);
  })
  .catch(error => {
    console.log("请求失败", error);
  });
```

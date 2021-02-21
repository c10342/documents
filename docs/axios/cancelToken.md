# axios 取消请求

- 新建一个`CancelToken`实例，该实例上面挂载了一个promise实例,同时将`resolve`方法暴露给外面
- 将实例传递给`axios`,`axios`发送请求的时候回调`CancelToken`实例中的promise。
- 外界调用`resolve`方法，就会中断请求

```javascript
function Axios(defaultConfig) {
  // 默认配置
  this.defaultConfig = defaultConfig;
}

Axios.prototype.request = function(config = {}) {
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
    if (config.cancelToken) {
      config.cancelToken.promise.then(() => {
        xhr.abort();
        reject(new Error("请求中断"));
      });
    }
  });
}

function createInstance(config) {
  const context = new Axios(config);
  const instance = Axios.prototype.request.bind(context);
  return instance;
}

const axios = createInstance();

function CancelToken(executor) {
  let resolvePromise;
  this.promise = new Promise(function(resolve, reject) {
    resolvePromise = resolve;
  });

  executor(function() {
    if (resolvePromise) {
      resolvePromise();
    }
  });
}

let cancel;

document.getElementById("emit").addEventListener("click", function() {
  const cancelToken = new CancelToken(function(c) {
    cancel = c;
  });
  axios({
    method: "get",
    url: "https://cnodejs.org/api/v1/topics",
    cancelToken
  })
    .then(res => {
      console.log("请求成功", res);
    })
    .catch(error => {
      console.log("请求失败", error);
    });
});

document.getElementById("off").addEventListener("click", function() {
  if (cancel) {
    cancel();
  }
});
```

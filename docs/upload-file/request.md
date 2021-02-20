# 请求函数

```javascript
function request({
  url,
  method = "post",
  data,
  headers = {},
  onProgress = (e) => e,
}) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = onProgress;
    xhr.open(method, url);
    Object.keys(headers).forEach((key) => {
      xhr.setRequestHeader(key, headers[key]);
    });
    xhr.send(data);
    xhr.onload = function(e) {
      resolve(e.target.response);
    };
    xhr.onerror = function(e) {
      reject(e);
    };
  });
}
```

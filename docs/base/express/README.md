# 实现一个简易 express

## 实现目标

```javascript
const express = require("./express");

const app = express();

app.use("/", function(req, res, next) {
  res.setHeader("Content-Type", "text/html;charset=utf-8");
  next();
});

app.use("/name", function(req, res, next) {
  next("名字不合法");
});

// app.get('/name',function(req,res){
//     res.end('张三')
// })

app.post("/age", function(req, res) {
  res.end("14");
});

app.all("/sex", function(req, res) {
  res.end("男");
});

app.use(function(err, req, res, next) {
  next(err);
});

app.use(function(err, req, res, next) {
  res.end(err);
});
app.listen(3000, function() {
  console.log("server listen on 3000");
});
```

## 源码

```javascript
const http = require("http");
const url = require("url");

function createApplication() {
  let app = (req, res) => {
    // 获取请求方法
    const m = req.method.toLocaleLowerCase();
    // 请求路径
    let { pathname } = url.parse(req.url, true);
    let index = 0;
    // next函数
    function next(err) {
      if (index === app.routes.length) {
        // 找不到对应的路由
        return res.end(`Cannot ${m} ${pathname}`);
      }
      const { method, path, handler } = app.routes[index++];
      if (err) {
        // next函数有参数的时候，直接调用错误中间件
        // handler.length  函数的参数长度
        if (handler.length === 4) {
          // 错误中间件参数必须是4个
          handler(err, req, res, next);
        } else {
          next(err);
        }
      } else {
        if (method === "middle") {
          // 处理中间件
          if (
            path === "/" ||
            path === pathname ||
            pathname.startsWith(path + "/")
          ) {
            if (handler.length !== 4) {
              // 一定要是非错误中间件，不然少一个参数，会报错
              handler(req, res, next);
            } else {
              next();
            }
          } else {
            next();
          }
        } else {
          // 处理路由
          if (
            (method === m || method === "all") &&
            (path === pathname || path === "*")
          ) {
            handler(req, res);
          } else {
            next();
          }
        }
      }
    }
    next();
  };
  // 存储路由
  app.routes = [];
  app.use = function(path, handler) {
    // use可能只有一个参数
    if (typeof handler !== "function") {
      handler = path;
      path = "/";
    }
    const layer = {
      method: "middle", //中间件
      path,
      handler
    };
    app.routes.push(layer);
  };
  // 内置一个中间件，用来解析扩展额外的功能
  app.use(function(req, res, next) {
    const { pathname, query } = url.parse(req.url, true);
    const hostname = req.headers.host.split(":");
    req.pathname = pathname;
    req.query = query;
    req.hostname = hostname[0];
    next();
  });
  app.all = function(path, handler) {
    const layer = {
      method: "all",
      path,
      handler
    };
    app.routes.push(layer);
  };
  // 获取所有请求方法
  http.METHODS.forEach(method => {
    method = method.toLocaleLowerCase();
    app[method] = function(path, handler) {
      const layer = {
        method,
        path,
        handler
      };
      app.routes.push(layer);
    };
  });

  app.listen = function(...reset) {
    const server = http.createServer(app);
    server.listen(...reset);
  };
  return app;
}

module.exports = createApplication;
```

# 合并切片

## 前端

```javascript
const SIZE = 10 * 1024 * 1024;
async function mergeRequest(filename) {
  await request({
    url: "http://localhost:3000/merge",
    headers: {
      "content-type": "application/json",
    },
    data: JSON.stringify({
      filename,
      size: SIZE,
    }),
  });
}
```

## 后台

```javascript
const fse = require('fs-extra')
const path = require('path')

const UPLOAD_DIR = path.resolve(__dirname, './files')

// 解析post请求体
const resolvePost = (req) => {
  return new Promise((resolve, reject) => {
    let chunk = "";
    req.on("data", (data) => {
      chunk += data;
    });
    req.on("end", () => {
      resolve(JSON.parse(chunk));
    });
  });
};
const pipeStream = (pathStr, writeStream) => {
  return new Promise((resolve) => {
    const readStream = fse.createReadStream(pathStr);
    readStream.on("end", () => {
      // 删除文件
      fse.unlinkSync(pathStr);
      resolve();
    });
    readStream.pipe(writeStream);
  });
};

// 合并切片
const mergeFileChunk = async (filePath, filename, size) => {
  const chunkDir = path.resolve(UPLOAD_DIR, "chunk-" + filename);

  const chunkPaths = await fse.readdir(chunkDir);
  // 根据切片下标进行排序
  chunkPaths.sort((a, b) => {
    const aa = a.split("-");
    const bb = b.split("-");
    return aa[aa.length - 1] - bb[bb.length - 1];
  });
  await Promise.all(
    chunkPaths.map((chunkpath, index) => {
      return pipeStream(
        path.resolve(chunkDir, chunkpath),
        // 指定位置创建可写流
        fse.createWriteStream(filePath, {
          start: index * size,
          end: (index + 1) * size,
        })
      );
    })
  );
  // 删除文件夹
  fse.rmdirSync(chunkDir);
};
server.on("request", async (req, res) => {
  if (req.url === "/merge") {
    const data = await resolvePost(req);
    const { filename, size } = data;
    const filePath = path.resolve(UPLOAD_DIR, filename);
    await mergeFileChunk(filePath, filename, size);
    res.end(
      JSON.stringify({
        code: 200,
        message: "file merage success",
      })
    );
  }
});
```

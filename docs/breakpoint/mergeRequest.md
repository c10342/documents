# 合并切片

## 前端

```javascript
/**
 * 请求后台合并切片
 * @param filename   文件名
 * @param size       每个切片的大小
 * @param fileHash   文件hash值
 * @returns {Promise<void>}
 */
async function mergeRequest(filename, fileHash) {
  await request({
    url: "http://localhost:3000/merge",
    headers: {
      "content-type": "application/json",
    },
    data: JSON.stringify({
      filename,
      size: SIZE,
      fileHash,
    }),
  });
}
```

## 后台

```javascript
const path = require("path");

const fse = require("fs-extra");

// 合并切片
const mergeFileChunk = async (filePath, filename, fileHash, size) => {
  const chunkDir = path.resolve(UPLOAD_DIR, fileHash);

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
        fse.createWriteStream(path.resolve(UPLOAD_DIR, filename), {
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
  // 合并切片
  if (req.url === "/merge") {
    const data = await resolvePost(req);
    const { filename, size, fileHash } = data;
    const filePath = path.resolve(UPLOAD_DIR, fileHash);
    await mergeFileChunk(filePath, filename, fileHash, size);
    res.end(
      JSON.stringify({
        code: 200,
        message: "file merage success",
      })
    );
  }
});
```

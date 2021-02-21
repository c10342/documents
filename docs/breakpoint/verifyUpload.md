# 检查是否已经上传过文件

## 前端

```javascript
/**
 * 检查是否已经上传过文件了
 * @param filename  文件名
 * @param fileHash  文件hash值
 * @returns {Promise<any>}
 */
async function verifyUpload(filename, fileHash) {
  const data = await request({
    url: "http://localhost:3000/verify",
    headers: {
      "content-type": "application/json",
    },
    data: JSON.stringify({
      filename,
      fileHash,
    }),
  });
  return JSON.parse(data);
}
```

## 后台

- 根据文件名查找是否已经根据切片生成了文件
- 没有生成文件，则获取已经上传的切片，返回给前端

```javascript
const path = require("path");

const fse = require("fs-extra");

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
// 返回上传碎片列表名
const createUploadList = async (fileHash) => {
  return fse.existsSync(path.resolve(UPLOAD_DIR, fileHash))
    ? await fse.readdir(path.resolve(UPLOAD_DIR, fileHash))
    : [];
};
server.on("request", async (req, res) => {
  if (req.url === "/verify") {
    const data = await resolvePost(req);
    const { filename, fileHash } = data;
    const filePath = path.resolve(UPLOAD_DIR, filename);

    if (fse.existsSync(filePath)) {
      res.end(
        JSON.stringify({
          shouldUpload: false,
        })
      );
    } else {
      res.end(
        JSON.stringify({
          shouldUpload: true,
          uploadList: await createUploadList(fileHash),
        })
      );
    }
  }
});
```

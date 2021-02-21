# 上传切片

## 前端

- 将切片上传给后台，其中上传参数包括:
  - `chunk`:切片文件
  - `hash`:切片的hash值，必须是唯一标识的，而且需要带上切片的索引值，否则后台不知道是第几个切片
  - `filename`:文件名，是上传的文件的文件名，不是切片的

```javascript
async function uploadChunks(data, filename) {
  let htmlStr = "";
  const requestList = data
    .map(({ chunk, hash, index }) => {
      const formData = new FormData();
      formData.append("chunk", chunk);
      formData.append("hash", hash);
      formData.append("filename", filename);
      return { formData, index };
    })
    .map(({ formData, index }) => {
      htmlStr += `
            <div class="progress">
                <div class="inner-progress" id="progress-${index}"></div>
            </div>
            `;
      return request({
        url: "http://localhost:3000/uploadFile",
        data: formData,
        onProgress: createProgressHandler(data[index]),
      });
    });
  box.innerHTML = htmlStr;
  await Promise.all(requestList);
}

// 上传进度显示
function createProgressHandler(item) {
  return (e) => {
    const progress = document.getElementById(`progress-${item.index}`);
    const percentage = e.loaded / e.total;
    progress.style.width = 700 * percentage + "px";
  };
}
```

## 后台

- 使用`multiparty`插件处理文件上传
- 首先需要新建一个存放切片的目录，将前端上传的前片存储在该目录中

```javascript
const multiparty = require("multiparty");
const fse = require("fs-extra");
const UPLOAD_DIR = path.resolve(__dirname, "./files");

server.on("request", async (req, res) => {
  if (req.url === "/uploadFile") {
    const multipart = new multiparty.Form({
      uploadDir: path.join(__dirname, "./chunks"),
    });

    multipart.parse(req, async (err, fields, files) => {
      if (err) {
        console.log("err");
        return;
      }
      // 获取上传的文件
      const chunk = files.chunk[0];
      // 获取前端传过来的hash
      const hash = fields.hash[0];
      // 获取前端传过来的文件名
      const filename = fields.filename[0];
      const chunkDir = path.resolve(UPLOAD_DIR, "chunk-" + filename);

      if (!fse.existsSync(chunkDir)) {
        await fse.mkdirSync(chunkDir);
      }

      // 修改文件名
      await fse.move(chunk.path, `${chunkDir}/${hash}`);
      res.end("received file chunk");
    });
  }

});
```

# 上传切片

## 前端

- 上传切片前先要获取已经上传的切片，然后再过滤掉已经上传的切片，只上传没上传的切片

```javascript
/**
 * 上传切片
 * @param fileChunkListData  请过处理的切片列表
 * {
        // 切片
        chunk: file,
        hash: hash + '-' + index,
        index,
        fileHash:hash,
        percentage:0
    }
 * @param filename       文件名
 * @param uploadedList   已经上传过的切片列表  [string]
 * @param dom             需要显示进度的dom容器
 * @param uploadFile      文件对象
 * @param requestList      需要上传的切片的xhr列表
 * @param fileHash      文件hash值
 * @returns {Promise<void>}
 */
async function uploadChunks(
  fileChunkListData,
  filename,
  uploadedList = [],
  dom,
  uploadFile,
  requestList,
  uploadFileHash
) {
  let htmlStr = "";
  // 生成html，显示上传进度
  fileChunkListData.forEach(({ hash, index, percentage }) => {
    const width = percentage === 100 ? "400px" : 0;
    const num = percentage === 100 ? "100%" : 0;
    htmlStr += `
            <div style="margin-top: 20px;">
                <div>${hash}(<span id="percent-${index}">${num}</span>)</div>
                <div class="progress">
                    <div style="width:${width}" class="inner-progress" id="progress-${index}"></div>
                </div>
            </div>
            `;
  });
  dom.innerHTML = htmlStr;
  // 过滤掉已经上传过得切片，并给每一个切片生成一个formData对象
  const requestListData = fileChunkListData
    .filter(({ hash }) => !uploadedList.includes(hash))
    .map(({ chunk, hash, index, fileHash }) => {
      const formData = new FormData();
      formData.append("chunk", chunk);
      formData.append("hash", hash);
      formData.append("filename", filename);
      formData.append("fileHash", fileHash);
      return { formData, index };
    })
    .map(({ formData, index }) => {
      return request({
        url: "http://localhost:3000/uploadFile",
        data: formData,
        onProgress: createProgressHandler(fileChunkListData[index]),
        requestList,
      });
    });

  // 等待所有碎片上传完毕
  await Promise.all(requestListData);

  // 之前上传的切片数量+本次上传的数量 = 所有切片数量
  if (
    uploadedList.length + requestListData.length ===
    fileChunkListData.length
  ) {
    await mergeRequest(uploadFile.name, uploadFileHash);
  }
}

/**
 * 上传进度显示
 * @param item 一个切片对象
 * {
        // 切片
        chunk: file,
        hash: hash + '-' + index,
        index,
        fileHash:hash,
        percentage:0
    }
 * @returns {function(...[*]=)}
 */
function createProgressHandler(chunk) {
  return (e) => {
    const progress = document.getElementById(`progress-${chunk.index}`);
    const percent = document.getElementById(`percent-${chunk.index}`);
    const percentage = e.loaded / e.total;
    percent.innerHTML = parseInt(percentage * 100) + "%";
    progress.style.width = 400 * percentage + "px";
    if (parseInt(percentage * 100) === 100) {
      chunk.percentage = 100;
    }
  };
}
```

## 后台

- 用文件的hash值作为文件夹的名称，存储上传的切片

```javascript
const path = require("path");

const multiparty = require("multiparty");

const fse = require("fs-extra");

const UPLOAD_DIR = path.resolve(__dirname, "./files");

server.on("request", async (req, res) => {
  // 上传切片
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
      // 获取前端传过来的切片hash
      const hash = fields.hash[0];
      // 获取前端传过来的文件名
      const filename = fields.filename[0];
      // 文件hash值
      const fileHash = fields.fileHash[0];

      const chunkDir = path.resolve(UPLOAD_DIR, fileHash);

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

# 使用例子

- 获取上传的文件对象
- 将文件对象切片
- 上传切片文件前，先请求后台是否已经生成了文件
  - 生成了，则不需要上传切片，直接提示用户已经上传完毕了
  - 没有生成文件，则后台需要返回已经上传过的切片文件的切片名回来，前端根据返回来的切片名过滤掉已经上传过的切片文件
- 上传切片完毕，如果上传的数量加上后台返回的已经上传的切片文件数量等于总的切片数量，则请求后台合并切片
- 后台根据切片名中的索引值将切片进行排序，然后把它们写进文件的指定位置

```html
<style>
  .progress {
    position: relative;
    height: 10px;
    width: 400px;
    background-color: #ebeef5;
  }

  .inner-progress {
    position: absolute;
    height: 10px;
    top: 0;
    left: 0;
    width: 0px;
    background-color: #409eff;
    transition: all 0.3s;
  }
</style>

<input type="file" id="fileInput" />
<button id="uploadBtn">上传</button>
<button id="pause">暂停</button>
<button id="resume">恢复</button>
<div style="margin-top: 20px;">
  计算文件哈希值进度（ <span id="hashmsg">0</span> ）
</div>
<div class="progress">
  <div class="inner-progress" id="fileHash"></div>
</div>
<div id="box"></div>
```

```javascript
const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const hashProgress = document.getElementById("fileHash");
const hashmsg = document.getElementById("hashmsg");
const pause = document.getElementById("pause");
const resume = document.getElementById("resume");
const box = document.getElementById("box");
// 上传的文件
let muploadFile;
// 切片请求xhr
let mrequestList = [];
// 文件hash值
let mhash;
// 存储文件切片
let mfileChunkListData;

// 暂停上传
pause.addEventListener("click", function() {
  mrequestList?.forEach((xhr) => xhr.abort());
  mrequestList = [];
});

// 恢复上传
resume.addEventListener("click", async function() {
  const { uploadList = [] } = await verifyUpload(muploadFile.name, mhash);

  await uploadChunks(
    mfileChunkListData,
    muploadFile.name,
    uploadList,
    box,
    muploadFile,
    mrequestList,
    mhash
  );
});

fileInput.addEventListener("change", function(e) {
  muploadFile = e.target.files[0];
});

// 上传按钮
uploadBtn.addEventListener("click", async function() {
  // 切片
  const fileChunkList = createFileChunk(muploadFile);

  mhash = await caculateHash(fileChunkList, hashmsg, hashProgress);

  const { shouldUpload, uploadList = [] } = await verifyUpload(
    muploadFile.name,
    mhash
  );
  if (!shouldUpload) {
    alert("秒传成功");
    return;
  }
  mfileChunkListData = fileChunkList.map(({ file }, index) => {
    return {
      // 切片
      chunk: file,
      hash: mhash + "-" + index,
      index,
      fileHash: mhash,
      percentage: uploadList.includes(mhash + "-" + index) ? 100 : 0,
    };
  });
  await uploadChunks(
    mfileChunkListData,
    muploadFile.name,
    uploadList,
    box,
    muploadFile,
    mrequestList,
    mhash
  );
});
```

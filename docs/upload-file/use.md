# 使用例子

```html
<style>
  .progress {
    margin-top: 20px;
    position: relative;
    height: 10px;
    width: 700px;
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
<div id="box"></div>
```

```javascript
const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const box = document.getElementById("box");
let uploadFile;

fileInput.addEventListener("change", function(e) {
  uploadFile = e.target.files[0];
  if (!uploadFile) {
    return;
  }
});

uploadBtn.addEventListener("click", async function() {
  // 切片
  const fileChunkList = createFileChunk(uploadFile);

  const data = fileChunkList.map(({ file }, index) => {
    return {
      // 切片
      chunk: file,
      hash: uploadFile.name + "-" + index,
      index,
    };
  });
  await uploadChunks(data, uploadFile.name);

  await mergeRequest(uploadFile.name);
});
```

# 生成切片

```javascript
// 切片大小
const SIZE = 10 * 1024 * 1024;
function createFileChunk(file, size = SIZE) {
  const fileChunkList = [];
  let cur = 0;
  while (cur < file.size) {
    fileChunkList.push({ file: file.slice(cur, cur + size) });
    cur += size;
  }
  return fileChunkList;
}
```
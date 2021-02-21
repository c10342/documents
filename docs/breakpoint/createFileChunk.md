
# 生成切片

- 将文件对象利用`slice`方法切成切片

```javascript
/**
 * 生成切片
 * @param uploadFile  需要切片的文件
 * @param size  每个切片的大小
 * @returns {[]}
 */
function createFileChunk(uploadFile, size = SIZE) {
    const fileChunkList = [];
    let cur = 0;
    while (cur < uploadFile.size) {
        fileChunkList.push({file: uploadFile.slice(cur, cur + size)});
        cur += size
    }
    return fileChunkList;
}
```
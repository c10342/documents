# 计算文件 hash 值

- 计算文件hash值使用`webwork`，在前台页面计算会造成卡顿

```javascript
/**
 * 计算文件hash值
 * @param fileChunkList  切片列表   {file: uploadFile.slice(cur, cur + size)}
 * @param dom1           需要显示百分比的容器
 * @param dom2           需要显示计算进度的容器
 * @returns {Promise<unknown>}
 */
function caculateHash(fileChunkList, dom1, dom2) {
  return new Promise((resolve, reject) => {
    const worker = new Worker("/webwork.js?time=" + Date.now());
    worker.postMessage({ fileChunkList });
    worker.onmessage = (e) => {
      const { percentage, hash } = e.data;
      dom1.innerHTML = `${parseInt(percentage)}%`;
      dom2.style.width = (percentage / 100) * 400 + "px";
      if (hash) {
        // 关闭webwork
        worker.terminate();
        resolve(hash);
      }
    };
  });
}
```

## webwork.js

- `spark-md5`计算文件的md5的hash值

```javascript
// 引入脚本
self.importScripts("https://cdn.bootcss.com/spark-md5/3.0.0/spark-md5.js");

// 生成hash
self.onmessage = (e) => {
  const { fileChunkList } = e.data;
  const spark = new SparkMD5.ArrayBuffer();
  let percentage = 0;
  let count = 0;

  const loadNext = (index) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(fileChunkList[index].file);
    reader.onload = (e) => {
      count++;
      spark.append(e.target.result);
      if (count === fileChunkList.length) {
        self.postMessage({
          percentage: 100,
          hash: spark.end(),
        });
        // 关闭自己
        self.close();
      } else {
        percentage += 100 / fileChunkList.length;
        self.postMessage({
          percentage,
        });
        // 递归计算下一个切片
        loadNext(count);
      }
    };
  };
  loadNext(0);
};
```

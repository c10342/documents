# 数组相关

## API 列表

### map 函数

```javascript
function map(array, callback) {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    result.push(callback(array[i], i));
  }
  return result;
}
const result = map([1, 2, 3], item => item * 10);
```

### reduce 函数

```javascript
function reduce(array, callback, defaultValue) {
  let result = defaultValue;
  for (let i = 0; i < array.length; i++) {
    result = callback(result, array[i], i);
  }
  return result;
}
const result = reduce([1, 2, 3], (prev, curr) => prev + curr, 0);
```

### filter 函数

```javascript
function filter(array, callback) {
  let result = [];
  for (let i = 0; i < array.length; i++) {
    const res = callback(array[i], i);
    if (res) {
      result.push(array[i]);
    }
  }
  return result;
}
const result = filter([1, 2, 3, 4], item => item >= 3);
```

### find 函数

```javascript
function find(array, callback) {
  for (let i = 0; i < array.length; i++) {
    const res = callback(array[i], i);
    if (res) {
      return array[i];
    }
  }
  return null;
}
const result = find([1, 2, 3, 4], item => item === 2);
```

### findIndex 函数

```javascript
function findIndex(array, callback) {
  for (let i = 0; i < array.length; i++) {
    const res = callback(array[i], i);
    if (res) {
      return i;
    }
  }
  return -1;
}
const result = findIndex([1, 2, 3, 4], item => item === 2);
```

### every 函数

```javascript
function every(array, callback) {
  for (let i = 0; i < array.length; i++) {
    const res = callback(array[i], i);
    if (!res) {
      return false;
    }
  }
  return true;
}
const result = every([2, 4, 6], item => item % 2 === 0);
```

### some 函数

```javascript
function some(array, callback) {
  for (let i = 0; i < array.length; i++) {
    const res = callback(array[i], i);
    if (res) {
      return true;
    }
  }
  return false;
}
const result = some([1, 3, 5], item => item % 2 === 0);
```

## 去重

可支持对象

### 双重循环

```javascript
/**
 * @param {*} array 数组
 * @param {*} valueKey 唯一值表示，当数组每一项是数组时比穿
 */
function unique(array, valueKey) {
  let result = [];
  for (let i = 0; i < array.length; i++) {
    let res = true;
    for (let j = 0; j < result.length; j++) {
      const isObj =
        Object.prototype.toString.call(array[i]) === "[object Object]";
      if (isObj && valueKey && array[i][valueKey] === result[j][valueKey]) {
        res = false;
        break;
      } else if (array[i] === result[j]) {
        res = false;
        break;
      }
    }
    if (res) {
      result.push(array[i]);
    }
  }
  return result;
}
const result = unique([1, 2, 3, 1, 5, 6, 3]);
```

### 利用 map 缓存

```javascript
/**
 * @param {*} array 数组
 * @param {*} valueKey 唯一值表示，当数组每一项是数组时比穿
 */
function unique(array, valueKey) {
  let result = [];
  const cacheMap = {};
  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    const isObj = Object.prototype.toString.call(item) === "[object Object]";
    if (isObj && valueKey) {
      if (!cacheMap[item[valueKey]]) {
        result.push(item);
        cacheMap[item[valueKey]] = true;
      }
    } else if (!cacheMap[item]) {
      result.push(item);
      cacheMap[item] = true;
    }
  }
  return result;
}
// const result = unique([1, 2, 3, 4, 3, 6])
const result = unique([{ id: 1 }, { id: 2 }, { id: 1 }], "id");
```

## 合并与切片

### concat 函数

```javascript
function concat(array, ...args) {
  for (let i = 0; i < args.length; i++) {
    const item = args[i];
    const isArray = Object.prototype.toString.call(item) === "[object Array]";
    if (isArray) {
      Array.prototype.push.apply(array, item);
    } else {
      array.push(item);
    }
  }
  return array;
}

const result = concat([1, 2, 3], 1, 2, [4, 5], 7, [8, 9]);
```

### slice 函数

```javascript
function slice(array, begin, end) {
  if (array.length === 0) {
    return [];
  }
  if (begin >= array.length) {
    return [];
  }
  begin = begin || 0;
  end = end || array.length;
  if (end <= begin) {
    end = array.length;
  }
  let result = [];
  for (let i = 0; i < array.length; i++) {
    if (i >= begin && i < end) {
      result.push(array[i]);
    }
  }
  return result;
}

const result = slice([1, 2, 3, 4, 5, 6], 1);
```

## 扁平

### 递归方式

```javascript
function flatten(array) {
  let result = [];
  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    if (Array.isArray(item)) {
      result = result.concat(flatten(item));
    } else {
      result = result.concat(item);
    }
  }
  return result;
}
const result = flatten([1, 2, [3, 4, [5, 6], 7], 8]);
```

### while 循环

```javascript
function flatten(array) {
  let result = array.slice();
  while (result.some(item => Array.isArray(item))) {
    result = [].concat(...result);
  }
  return result;
}
const result = flatten([1, 2, [3, 4, [5, 6], 7], 8]);
```

## 分块

```javascript
function chunk(array, size = 1) {
  const result = [];
  let tmp = [];
  for (let i = 0; i < array.length; i++) {
    // 利用引用值类型特征
    if (tmp.length === 0) {
      result.push(tmp);
    }
    tmp.push(array[i]);
    if (tmp.length === size) {
      tmp = [];
    }
  }
  return result;
}

const result = chunk([1, 2, 3, 4, 5, 6, 7, 8], 3);
```

## 差集

```javascript
function difference(...args) {
  const result = [];
  let tmp = [].concat(...args);
  for (let i = 0; i < tmp.length; i++) {
    let res = true;
    for (let j = 0; j < tmp.length; j++) {
      if (i !== j && tmp[i] === tmp[j]) {
        res = false;
        break;
      }
    }
    if (res) {
      result.push(tmp[i]);
    }
  }
  return result;
}
const result = difference([1, 2, 3, 4, 5], [3, 4, 5, 6, 7, 8], [8, 9, 10]);
```

## 删除数组元素

```javascript
function pull(array, ...args) {
  let result = [];
  for (let i = 0; i < array.length; i++) {
    if (args.indexOf(array[i]) != -1) {
      result.push(array[i]);
      array.splice(i, 1);
      // 删除之后，i需要减一，否则后面一项遍历不到
      i--;
    }
  }
  return result;
}

const arr = [1, 2, 3, 4, 5, 6, 7];
const result = pull(arr, 1, 3, 6, 8);
```

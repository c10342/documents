# 对象相关

## 创建对象

```javascript
function person(name, age) {
  this.name = name;
  this.age = age;
}

const obj = newInstance(person, "张三", 14);

function newInstance(fn, ...agrs) {
  const obj = {};
  // 构造器可能直接return一个对象
  const result = fn.call(obj, ...agrs);
  obj.__proto__ = fn.prototype;
  return result instanceof Object ? result : obj;
}
```

## instanceof

```javascript
function person(name, age) {
  this.name = name;
  this.age = age;
}

function myInstanceof(instance, constructor) {
  // 显示原型
  const prototype = constructor.prototype;
  // 隐示原型
  let proto = instance.__proto__;
  // 判断显示原型是否在隐示原型上面
  while (proto) {
    if (proto === prototype) {
      return true;
    }
    proto = proto.__proto__;
  }
  return false;
}
const p = new person("张三", 12);

console.log(myInstanceof(p, person));
```

## 合并对象

重名不覆盖，会变成数组

```javascript
function mergeObject(...args) {
  const result = {};
  args.forEach(arg => {
    for (const key in arg) {
      if (result.hasOwnProperty(key)) {
        result[key] = [].concat(result[key], arg[key]);
      } else {
        result[key] = arg[key];
      }
    }
  });
  return result;
}

const result = mergeObject(
  {
    a: [1, 2],
    b: 2,
    c: "hello"
  },
  {
    a: 1,
    b: [4, 5]
  }
);
```

## 深拷贝

```javascript
function deepClone(target, map = new Map()) {
  if (typeof target === "object" && target !== null) {
    // 缓存，防止循环引用
    const cache = map.get(target);
    if (cache) {
      return cache;
    }
    const isArray = Array.isArray(target);
    const result = isArray ? [] : {};
    // 缓存，防止循环引用
    map.set(target, result);
    if (isArray) {
      target.forEach((key, index) => {
        result[index] = deepClone(target[index], map);
      });
    } else {
      Object.keys(target).forEach(key => {
        result[key] = deepClone(target[key], map);
      });
    }
    return result;
  } else {
    return target;
  }
}

const object = {
  a: 1,
  b: [1, 2],
  c: { d: 5 }
};

object.b.push(object.c);
object.c.h = object.b;

const result = deepClone(object);
```

# 设计模式

## SOLID 五大设计原则

- `S` 单一原则
- `O` 开放封闭原则
- `L` 李氏置换原则
- `I` 接口独立原则
- `D` 依赖导致原则

## 设计类型

### 创建型

- 工厂模式（工厂方法模式，抽象工厂模式，创造者模式）
- 单例模式
- 原型模式

### 结构型

- 适配器模式
- 装饰器模式
- 代理模式
- 外观模式
- 桥接模式
- 组合模式
- 享元模式

### 行为型

- 策略模式
- 模板方法模式
- 观察者模式
- 迭代器模式
- 职责连模式
- 命令模式
- 备忘录模式
- 状态模式
- 访问者模式
- 中介者模式
- 解释器模式

## 区别

### 代理模式 VS 适配器模式

- 适配器模式：提供一个不同的接口（如不同版本的插头）
- 代理模式：提供一模一样的接口

### 代理模式 VS 装饰器模式

- 装饰器模式：扩展功能，且原有功能不变
- 代理模式：显示原有功能，但是经过限制或者阉割之后

## 适配器模式

- 一些旧的接口不使用，需要使用适配器进行转换
- 将旧接口和使用者分离
- 使用场景：一个使用 jquery 的 ajax 网页要舍弃 jquery，这时候只需要实现\$.ajax({})即可，无需修改以前代码

```javascript
// 旧接口
class Target {
  getName() {
    return "张三";
  }
}
// 适配器
class Adapter {
  requset() {
    let target = new Target();

    return `我是${target.getName()}`;
  }
}
// 使用者
class Client {
  constructor() {
    this.target = new Adapter();
  }
  say() {
    console.log(this.target.requset());
  }
}

let client = new Client();

client.say();
```

## 装饰器模式

- 在不改变原有的功能和接口上添加功能

```javascript
class Circle {
  draw() {
    console.log("画一个圆角");
  }
}
class Dec {
  constructor(circle) {
    this.circle = circle;
  }

  draw() {
    this.circle.draw();
    this.setBorder();
  }

  setBorder() {
    console.log("添加边框");
  }
}

let c = new Circle();

c.draw();

let d = new Dec(c);

d.draw();
```

- es7 装饰器，所有装饰器都是一个函数
- 首先需要安装 babel-plugin-transform-decorators-legacy 来支持装饰器

```javascript
// 该装饰器的作用是在装饰的目标上的原型上添加属性和方法
function test(list) {
  return function(target) {
    Object.assign(target.prototype, list);
  };
}
let list = {
  foo() {
    console.log("foo");
  }
};
// 装饰一个类
@test(list)
class Person {}

let p = new Person();

p.foo();
```

```javascript
// 该装饰器的作用是使属性只能读不能写
function readOnly(target, name, desc) {
  console.log(target); //Math 装饰的对象
  console.log(name); //name 装饰的方法名称
  console.log(desc); //属性描述对象

  // 禁止写
  desc.writable = false;

  return desc;
}
// 打印出日志
function log(target, name, desc) {
  // 保存旧的value
  let oldVal = desc.value;
  // 改写value
  desc.value = function() {
    console.log(arguments);
    // 利用旧的value返回结果
    return oldVal.apply(this, arguments);
  };

  return desc;
}
class Math {
  @log
  add(a, b) {
    return a + b;
  }

  // 装饰一个方法
  @readOnly
  name() {
    return "张三";
  }
}

let m = new Math();

console.log(m.name());

// 报错
// m.name = function () {
//     alert(111)
// }

console.log(m.add(1, 2));
```

## 工厂模式

- 就是封装 new 操作
- 常用场景：
  - jquery：window.\$=function(selector){return new Jquery(selector)}
  - React.createElement() 返回 Vnode 实例
  - vue 异步组件

```javascript
class Product {
  constructor(name) {
    this.name = name;
  }

  init() {
    console.log("init");
  }

  fn1() {
    console.log("fn1");
  }
}

// 利用工厂生成实例
class Creator {
  create(name) {
    return new Product(name);
  }
}

const creator = new Creator();

let p = creator.create("汽车");

p.init();

p.fn1();
```

## 迭代器模式

```javascript
// 遍历器
class Iterator {
  constructor(container) {
    this.list = container.list;
    this.index = 0;
  }
  next() {
    if (this.hasNext()) {
      return this.list[this.index++];
    }
  }
  hasNext() {
    if (this.index >= this.list.length) {
      return false;
    }
    return true;
  }
}

class Container {
  constructor(list) {
    this.list = list;
  }

  // 生成遍历器
  getIterator() {
    return new Iterator(this);
  }
}

let arr = [1, 2, 3, 4, 5, 6];

const container = new Container(arr);

const iterator = container.getIterator();

while (iterator.hasNext()) {
  console.log(iterator.next());
}
```

es6 Iterator

```javascript
// function each(data){
//     // 所有的有序数据集合都有Symbol.iterator这个属性，该属性返回的是一个遍历器
//     // object不是有序集合，但是可以通过Map变成有序集合
//     let iterator = data[Symbol.iterator]()

//     let item = {done:false}
//     while(!item.done){
//         item = iterator.next()
//         if(!item.done){
//             console.log(item.value)
//         }

//     }
// }

function each(data) {
  // for of 实际上是Symbol.iterator遍历器的一个语法糖
  for (const iterator of data) {
    console.log(iterator);
  }
}

let arr = [1, 2, 3, 4];
let map = new Map();
map.set("a", 100);
map.set("b", 200);

each(arr);
each(map);
```

## 观察者模式

- 使用场景
  - 网页事件绑定
  - jquery.Callbacks 回调函数
  - node 自定义事件
  - vue 和 react 声明周期函数
  - 主题，保存状态，当状态改变时触发所有观察者更新

```javascript
class Subject {
  constructor() {
    this.state = 0;
    this.observers = [];
  }
  // 获取状态
  getState() {
    return this.state;
  }
  // 修改状态，并且触发所有观察者更新
  setState(state) {
    this.state = state;
    this.notifyAllObserver();
  }
  // 执行所有观察者
  notifyAllObserver() {
    this.observers.forEach(observer => {
      observer.update();
    });
  }
  // 添加观察者
  attach(observer) {
    this.observers.push(observer);
  }
}

// 观察者
class Observer {
  constructor(name, subject) {
    this.name = name;
    this.subject = subject;
    // 添加观察者
    this.subject.attach(this);
  }
  update() {
    console.log(`${this.name} update,state:${this.subject.state}`);
  }
}

let subject = new Subject();

let o1 = new Observer("o1", subject);
let o2 = new Observer("o2", subject);
let o3 = new Observer("o3", subject);

subject.setState(1);
subject.setState(2);
subject.setState(3);
```

```javascript
const EventEmitter = require("events").EventEmitter;

const event = new EventEmitter();

event.on("message", obj => {
  console.log(obj.name);
});

event.on("message", obj => {
  console.log(obj.age);
});

setInterval(() => {
  event.emit("message", { name: "zhangsan", age: 14 });
}, 1000);
```

```javascript
const EventEmitter = require("events").EventEmitter;
class Dog extends EventEmitter {
  constructor(name) {
    super();
    this.name = name;
  }
}

const dog = new Dog("张三");
dog.on("bark", function() {
  console.log(this.name + " : bark");
});

dog.emit("bark");
```

## 代理模式

- 即对象不能访问目标，只能通过中间层去访问
- 使用场景
  - 事件委托
  - jquery 的\$.proxy，es6 的 proxy

```javascript
class Target {
  loadingFile() {
    console.log("loadingFile");
  }
}

class Proxy {
  constructor() {
    this.target = new Target();
  }
  loadingFile() {
    this.target.loadingFile();
  }
}

const proxy = new Proxy();
proxy.loadingFile();
```

es6 proxy

```javascript
let star = {
  name: "张三",
  age: 24,
  phone: "star:12800011"
};

let agent = new Proxy(star, {
  get: function(target, key) {
    // target是代理的对象,key是要获取的值
    if (key == "phone") {
      return "agent:33190000";
    }
    if (key == "price") {
      return 12000;
    }
    return target[key];
  },
  set: function(target, key, val) {
    // target是代理的对象,key是要获取的值,val是要设置的值
    if (key == "customPrice") {
      if (val < 12000) {
        throw new Error("价格太低");
      } else {
        target[key] = val;
        return true;
      }
    }
  }
});

console.log(agent.name);
console.log(agent.age);
console.log(agent.phone);
console.log(agent.price);

agent.customPrice = 15000;
console.log(agent.customPrice);
```

## 单例模式

- 即一个类只能有一个实例
- 使用场景
  - Jquery if(windows.jquery){return windows.jquery}else{}
  - vuex
  - redux

```javascript
class Single {
  login() {
    console.log("login");
  }
}

// 使用闭包私有化属性
Single.getInStance = (function() {
  let instance = null;
  return function() {
    if (!instance) {
      instance = new Single();
    }
    return instance;
  };
})();

let obj1 = Single.getInStance();

let obj2 = Single.getInStance();

let obj3 = new Single();

obj1.login();

obj2.login();

console.log(obj2 === obj1);
```

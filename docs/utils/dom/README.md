# DOM

## 事件委托

```javascript
function addListener(el, type, fn, selector) {
  if (typeof el === "string") {
    el = document.querySelector(el);
  }
  if (!selector) {
    el.addEventListener(type, fn);
  } else {
    el.addEventListener(type, function(event) {
      const target = event.target;
      //  判断点击元素是否与选择器匹配
      if (target.matches(selector)) {
        fn.call(target, event);
      }
    });
  }
}

addListener(
  "#item",
  "click",
  function(event) {
    console.log(this.innerHTML);
  },
  "li"
);
```

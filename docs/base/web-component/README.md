# WebComponent

## hello-world

```html
<hello-word message="web-component"></hello-word>

<template id="hw-temp">
  <!-- 样式,只在template内部有效 -->
  <style>
    p {
      color: red;
      font-size: 20px;
    }
  </style>
  <p>hello word</p>
</template>
<script>
  class HelloWorld extends HTMLElement {
    constructor() {
      super();

      // 1、得到组件的模板内容
      const temp = document.querySelector("#hw-temp").content;

      // 2、创建组件的根元素，影子DOM节点
      const shadowRoot = this.attachShadow({ mode: "open" });

      // 3、将模板节点添加到影子DOM节点中
      shadowRoot.appendChild(temp.cloneNode(true));

      // 获取传递进来的message
      const message = this.getAttribute("message");
      // 修改组件内容
      shadowRoot.querySelector("p").innerHTML = message;
    }
  }
  // 注册组件
  customElements.define("hello-word", HelloWorld);
</script>
```

## 组件生命周期

```html
<comp-life></comp-life>

<template id="temp">
  <style>
    p {
      color: red;
      font-size: 20px;
    }
  </style>
  <p>组件生命周期</p>
</template>
<script>
  class CompLife extends HTMLElement {
    constructor() {
      super();

      const temp = document.querySelector("#temp").content;

      const shadowRoot = this.attachShadow({ mode: "open" });

      shadowRoot.appendChild(temp.cloneNode(true));
    }

    // 组件首次被插入到文档DOM时
    connectedCallback() {
      console.log("connectedCallback");
    }

    // 组件从文档中被删除
    disconnectedCallback() {
      console.log("disconnectedCallback");
    }

    // 组件被移动到新的文档时
    adoptedCallback() {
      console.log("adoptedCallback");
    }

    // 组件增删改自身属性
    attributeChangedCallback() {
      console.log("attributeChangedCallback");
    }
  }

  customElements.define("comp-life", CompLife);
</script>
```

## 插槽

```html
<comp-life>
  <p slot="content">插槽</p>
</comp-life>

<template id="temp">
  <!-- 全局样式对组件无效 -->
  <style>
    p {
      /* color: red; */
      font-size: 20px;
    }
  </style>
  <div>
    <!-- 组件样式不影响插槽样式 -->
    <slot name="content"></slot>
    <p class="p">1313132</p>
  </div>
</template>
<script>
  class CompLife extends HTMLElement {
    constructor() {
      super();

      const temp = document.querySelector("#temp").content;

      const shadowRoot = this.attachShadow({ mode: "open" });

      shadowRoot.appendChild(temp.cloneNode(true));
    }

    // 组件首次被插入到文档DOM时
    connectedCallback() {
      console.log("connectedCallback");
    }

    // 组件从文档中被删除
    disconnectedCallback() {
      console.log("disconnectedCallback");
    }

    // 组件被移动到新的文档时
    adoptedCallback() {
      console.log("adoptedCallback");
    }

    // 组件增删改自身属性
    attributeChangedCallback() {
      console.log("attributeChangedCallback");
    }
  }

  customElements.define("comp-life", CompLife);
</script>
```

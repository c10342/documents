# cli 工具开发

## 依赖

- commander：指令操作工具
- download-git-repo：下载 github 仓库
- inquirer：与用户交互的命令工具
- handlebars：处理模板
- ora：添加 loading 效果
- chalk：给字体增加颜色
- log-symbols：添加图标

## 注意事项

使用 node 开发命令行工具所执行的 js 脚本必须在首行加入 `#!/usr/bin/env node` ，用来指明该脚本文件使用 node 来执行

`/usr/bin/env` 用来告诉用户到 path 目录去寻找 node
`#!/usr/bin/env node` 可以让系统动态的去查找 node，以解决不同用户不同设置的问题

## version 命令

```javascript
program.version("0.1.0");
```

## init 命令

模板

```javascript
// 在github上用https方式下载
var templates = {
  "template-a": {
    // 仓库地址
    url: "https://github.com/c10342/html5-online-answer-page",
    // 下载地址
    downloadUrl:
      "direct:https://github.com/c10342/html5-online-answer-page.git",
    description: "a模板"
  },
  "template-b": {
    url: "https://github.com/c10342/html5-online-answer-background",
    downloadUrl:
      "direct:https://github.com/c10342/html5-online-answer-background.git",
    description: "b模板"
  },
  "template-c": {
    url: "https://github.com/c10342/vue-music",
    downloadUrl: "direct:https://github.com/c10342/vue-music.git",
    description: "c模板"
  },
  "template-d": {
    url: "https://github.com/c10342/template-test",
    downloadUrl: "direct:https://github.com/c10342/template-test.git",
    description: "d模板"
  }
};
```

```javascript
program
  .command("init <template> <project>")
  .description("初始化项目模板")
  .action(function(templateName, projectName) {
    // 与用户交互
    inquirer
      .prompt([
        {
          type: "input",
          name: "description",
          message: "请输入项目描述："
        },
        {
          type: "input",
          name: "author",
          message: "请输入项目作者："
        }
      ])
      .then(answers => {
        // 根据模板名下载对应的模板到本地
        var { downloadUrl } = templates[templateName];
        var spinner = ora("正在下载中...").start();
        download(downloadUrl, projectName, { clone: true }, err => {
          if (err) {
            console.log(err);
            spinner.fail(); //下载失败
            console.log(logSymbols.error, chalk.red("下载失败"));
          } else {
            let packagePath = `${projectName}/package.json`;
            let packageStr = fs.readFileSync(packagePath, "utf-8");
            let package = handlebars.compile(packageStr)(answers);
            fs.writeFileSync(packagePath, package);
            spinner.succeed(); //下载成功
            console.log(logSymbols.success, chalk.green("模板初始化成功"));
          }
        });
      });
  });
```

## list 命令

```javascript
program
  .command("list")
  .description("查看所有可用模板")
  .action(() => {
    for (let key in templates) {
      console.log(`${key}  ${templates[key].description}`);
    }
  });
```

## 初始化

```javascript
program.parse(process.argv);
```

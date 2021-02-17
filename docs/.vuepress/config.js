module.exports = {
    title: '前端进阶',
    description: '前端进阶',
    // head: [ // 注入到当前页面的 HTML <head> 中的标签
    //     ['link', { rel: 'icon', href: '/logo.jpg' }], // 增加一个自定义的 favicon(网页标签的图标)
    // ],
    base: '/', // 这是部署到github相关的配置
    markdown: {
        lineNumbers: false // 代码块显示行号
    },
    themeConfig: {
        displayAllHeaders: true,
        pageClass: 'custom-page',
        nav: [
            { text: '前端积累', link: '/base/express/' },
            { text: '函数工具库', link: '/utils/function/' },
            {
                text: '源码分析',
                items: [
                    { text: 'vue', link: '/vue/dom-diff/' },
                    {
                        text: 'axios',
                        link: '/axios/createInstance/'
                    }
                ]
            },
            // 下拉列表
            {
                text: '组件库',
                items: [
                    { text: 'vue组件库', link: 'http://ui.linjiafu.top/' },
                    {
                        text: '微信小程序组件库',
                        link: 'http://wxui.linjiafu.top/'
                    }
                ]
            },
            {
                text: '其他',
                items: [
                    { text: 'CSDN', link: 'https://blog.csdn.net/vgub158' },
                ]
            },
            { text: 'github', link: 'https://github.com/c10342' }
        ],
        sidebar: {
            '/vue/': [
                'dom-diff/',
                'data-response/',
                'ast/',
                'instructions/',
            ],
            '/base/': [
                'express/',
                'design-pattern/',
                'web-component/',
                'cli/',
            ],
            '/utils/': [
                'function/',
                'array/',
                'dom/',
                'event-bus/',
                'object/',
                'pub-sub/',
            ],
            '/axios/': [
                'createInstance/',
                'request/',
                'interceptor/',
                'cancelToken/',
            ],
        },
        sidebarDepth: 2, // e'b将同时提取markdown中h2 和 h3 标题，显示在侧边栏上。
        lastUpdated: 'Last Updated', // 文档更新时间：每个文件git最后提交的时间
        // sidebar: 'auto'
    }
};
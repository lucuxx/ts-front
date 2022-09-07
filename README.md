## 开发

```bash

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npmmirror.com

# 启动服务
npm run dev

```

## 开发规范

```bash
# 代码提交请遵守commit 规范
详情查看 commitlint.config.js 文件


**Component**
# 所有的Component文件都是以大写开头 (PascalCase)，这也是官方所推荐的。
# 但除了 index.vue。

例子：

1. @/components/BackToTop/index.vue
2. @/components/Charts/Line.vue
3. @/views/example/components/Button.vue


**Js**
# 所有的.js文件都遵循横线连接 (kebab-case)。

例子：

1. @/utils/open-window.js
2. @/views/svg-icons/require-icons.js
3. @/components/MarkdownEditor/default-options.js


**View**
# 在views文件下，代表路由的.vue文件都使用横线连接 (kebab-case)，代表路由的文件夹也是使用同样的规则。

例子：

1. @/views/svg-icons/index.vue
2. @/views/svg-icons/require-icons.js

# 使用横线连接 (kebab-case)来命名views主要是出于以下几个考虑。

1. 横线连接 (kebab-case) 也是官方推荐的命名规范之一 文档
2. views下的.vue文件代表的是一个路由，所以它需要和component进行区分(component 都是大写开头)
3. 页面的url 也都是横线连接的，比如https://www.xxx.admin/export-excel，所以路由对应的view应该要保持统一
4. 没有大小写敏感问题
```

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```
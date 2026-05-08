# homepage

一个纯静态的个人主页项目，用于展示我的的个人介绍、技术栈、工作经历和项目经历。

## 项目结构

```text
.
├── index.html    # 中文首页
├── en.html       # 英文页面
├── style.css     # 全站样式
├── index.js      # 主题切换、移动端切换器交互、滚动动画
├── favicon.ico   # 网站图标
└── favicon.svg   # SVG 图标
```

## 功能说明

- 中英文双页面
- 浅色 / 深色 / 跟随系统主题
- 基于 GSAP + ScrollTrigger 的卡片滚动动画
- SEO 基础信息与结构化数据
- 响应式布局，适配桌面端和移动端

## 本地预览

1. 直接使用静态服务器即可预览（推荐）。

```bash
npx serve .
```

2. 或直接打开 `index.html` 进行查看。

## 依赖说明

项目本身没有包管理配置，前端动画依赖通过 CDN 引入：

- `gsap@3.12.5`
- `ScrollTrigger@3.12.5`

## 部署

可直接部署到任意静态托管平台，例如：

- GitHub Pages
- Vercel
- Netlify
- Nginx 静态站点

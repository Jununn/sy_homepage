# DataVerse Homepage

上海数元衍宇智能科技有限公司的中英文官网首页。品牌名：**DataVerse**。

## 本地预览

```sh
npm run dev
```

访问 http://127.0.0.1:4173 。网站为纯静态 HTML/CSS/JavaScript，不需要安装依赖或构建。

```sh
npm run check
```

## 内容与样式

- `dist/index.html`：页面结构及无 JavaScript 时可直接阅读的中文内容。
- `dist/content.js`：中文和英文文案。语言选择保存在访问者的本地浏览器中。
- `dist/styles.css`：响应式样式及减少动态效果的偏好支持。
- `dist/app.js`：语言切换、导航状态和轻量 SVG 数据图。
- `dist/assets/wentao.jpg`：张文涛个人主页所公开的本人照片。

更新文案时同时维护 `content.js` 和 `index.html` 的中文内容。

## 内容依据与待补资料

- 设计参考：https://unipat.ai/ 。独立实现代码、品牌和文案。
- 张文涛的简介与照片来源：https://zwt233.github.io/ 。仅使用简短可验证履历，不添加公司职位。
- 王雪目前仅展示姓名，无职位、履历或虚构照片。WX 图案是姓名字母图形。
- 公司正式名称与品牌名由用户提供。英文法定名称未确认，英文页面页脚继续使用中文法定名称。
- 公司邮箱尚未提供，联系按钮指向张文涛个人主页。收到邮箱后将其替换为公司联系邮箱。
- 业务方向为首版定位文案，待公司确认具体产品及服务后可进一步更新；未添加客户、业绩数字或产品成果。

## 发布

`dist/` 可直接用于 GitHub Pages、Cloudflare Pages 或任意静态托管。若使用 GitHub Pages，请在仓库设置中选择 GitHub Actions，然后启用附带的手动部署工作流。

Sites 私有预览的部署配置存放在 `.openai/hosting.json`。GitHub Actions 工作流不会自动运行；在正式资料确认后可手动发布到 GitHub Pages。

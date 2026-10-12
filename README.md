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

## 数据样本迁移

首页新增数据展示区域，`datasets.html` 提供单轮图像拖动对比、多轮编辑逐步浏览、文本/SQL/代码阅读、Coding Agent 工具轨迹展开及单条 JSON 下载。

迁移来源为 [OpenDCAI_Data](https://github.com/haolpku/OpenDCAI_Data)，固定版本 `7cd08ea8c830d304b63130c5303c39ae80cc251e`。这是**展示样本迁移**，不是全量训练语料迁移。当前文件实际包含的展示样本数与原 README 的每类 100+ 条描述不同，本站仅显示实际迁入数量。

| 类别 | 迁入样本 | 选择依据 |
| --- | ---: | --- |
| 单轮图像编辑 | 3 | 迁入全部公开图像对、原始编辑指令及不变约束 |
| 多轮图像编辑 | 3 | 完整轮次、规则变更、跨版本组合和历史引用 |
| 文本 SFT | 1 | 回答完整，保留 SuperFiltering 和 Deita 原始分数；其他展示回答有截断 |
| Text2SQL | 3 | SQL 在构造的 SQLite 测试表上核验结果，保留原始问题和推理 |
| 代码生成 | 1 | 原始循环移位解答通过题面示例及 5 个非空输入测试；并非完整测试覆盖 |
| Coding Agent | 2 | stats.py 修复和 slow_dedup.py 重构，含工具/观察记录；排除 mock 知识检索轨迹 |

没有迁入缺少 `List` 导入的代码样本及发现题面不一致的数学样本。没有修改样本回答来提高评分。自动评分仅以源记录分数展示，不作为 DataVerse 独立评测，不跨量表比较，也不对整体数据质量做数量化承诺。

- `dist/datasets-data.js`：精选记录、双语类别和标题；原始内容不翻译或改写，仅重定位本地图像路径。
- `dist/datasets-provenance.json`：来源版本、类别索引和 27 张展示图像的 SHA-256。
- `dist/assets/datasets/`：源仓库展示缩略图，按字节原样复制。原始记录中的高分辨率参数不等于当前缩略图分辨率。
- 原始仓库没有提供 LICENSE 文件；此迁移保留来源，并不赋予新增商业授权或再分发许可，公开商用发布前需确认各原始数据来源的具体许可。

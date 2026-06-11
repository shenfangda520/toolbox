<p align="center">
  <img src="https://img.shields.io/badge/Tauri-2.x-blue?logo=tauri" alt="Tauri">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Rust-1.75+-000?logo=rust" alt="Rust">
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License">
  <img src="https://img.shields.io/badge/Platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey" alt="Platform">
</p>

<h1 align="center">🧰 Toolbox</h1>

<p align="center">
  <strong>开发者 + 运营 + 工业 三合一跨平台桌面工具箱</strong><br>
  <sub>34+ 开箱即用的效率工具，覆盖开发调试、内容创作、工业数字孪生等场景</sub>
</p>

<p align="center">
  <a href="https://github.com/shenfangda520/toolbox/releases">📦 下载安装包</a>
  ·
  <a href="#-快速开始">🚀 快速开始</a>
  ·
  <a href="#-工具一览">📋 工具列表</a>
  ·
  <a href="https://github.com/shenfangda520/toolbox/issues">🐛 反馈问题</a>
</p>

---

## ✨ 为什么选择 Toolbox？

| 传统方案 | Toolbox |
|----------|---------|
| 装 10+ 个网站书签 | 一个桌面应用搞定 |
| JSON 在线工具、正则在另一个站 | 统一界面，一键切换 |
| API 调试要开 Postman | 内置 Postman 风格调试器 |
| 工业协议没趁手工具 | PLC 模拟 + 协议调试 |
| 文章排版到处复制粘贴 | Markdown 直接导出高清图片 |

## 🎯 核心特性

- **🚀 极致轻量** — Tauri 构建，安装包仅 ~4MB（远小于 Electron 方案）
- **⚡ 原生性能** — Rust 后端，启动秒开，内存占用极低
- **🌙 深色主题** — 默认暗色 UI，长时间使用不伤眼
- **🔍 全局搜索** — 输入关键词，秒级定位任意工具
- **📂 智能分类** — 6 大类别，折叠展开，一目了然
- **🌐 完全离线** — 本地优先，无需联网，数据不上传
- **💻 跨平台** — macOS / Windows / Linux 全覆盖

## 📦 工具一览（34+）

<details>
<summary><strong>💻 开发工具（14 个）</strong></summary>

| 工具 | 功能 | 快捷键 |
|------|------|--------|
| JSON 格式化 | 格式化 / 压缩 / 校验 | — |
| YAML 格式化 | YAML ↔ JSON 互转 | — |
| XML 格式化 | 格式化 / 压缩 | — |
| Base64 编解码 | 文本 ↔ Base64 | — |
| URL 编解码 | encodeURIComponent / decode | — |
| 哈希生成 | SHA-256 / MD5 | — |
| 正则测试 | 实时匹配 + 高亮 | — |
| 时间戳转换 | 秒/毫秒 ↔ 日期时间 | — |
| 文本对比 | 逐行 Diff 对比 | — |
| Git Commit 生成 | Conventional Commits 规范 | — |
| CSS Box Model | 盒模型可视化调试 | — |
| JWT 解析 | Header / Payload 解码 | — |
| Mock 数据生成 | 自定义模板批量生成 | — |
| Tailwind 生成器 | 点选类名 + HTML 导出 | — |
| **API 调试器** | **Postman 风格，支持 Params/Headers/Body/Auth** | `Enter` 发送 |

</details>

<details>
<summary><strong>📝 运营工具（7 个）</strong></summary>

| 工具 | 功能 |
|------|------|
| MD 排版导出 | 5 种主题 + 渐变背景 + 导出 2x PNG |
| 字数统计 | 中英文字符 / 词汇 / 段落 / 阅读时间 |
| AI 文案工作台 | DeepSeek 驱动的文案润色 / 改写 / 翻译 |
| 多平台发帖 | 微博 / X / LinkedIn / 小红书 / 公众号适配 |
| 图片压缩 | 批量 JPEG 压缩，实时压缩比 |
| 图片水印 | 文字水印 + 位置 / 透明度调节 |
| 批量重命名 | 前缀 / 后缀 / 查找替换 / 序号变量 |

</details>

<details>
<summary><strong>🏭 工业工具（6 个）</strong></summary>

| 工具 | 功能 |
|------|------|
| CSV 查看器 | 表格渲染 + 导出 |
| Hex 编辑器 | 十六进制 ↔ ASCII 文本 |
| 协议调试器 | TCP / UDP 客户端模拟 |
| 日志解析器 | ERROR/WARN/INFO 级别过滤 |
| 单位换算 | 温度 / 压力 / 流量 / 长度 / 重量 |
| PLC 数据模拟 | DB 块读写 + 传感器值模拟 |

</details>

<details>
<summary><strong>⚡ 生产力（7 个）</strong></summary>

| 工具 | 功能 |
|------|------|
| 番茄计时器 | 25/5 分钟 + SVG 进度环 |
| 密码生成器 | 自定义长度 / 大小写 / 数字 / 符号 |
| 占位文本生成 | 中英文 Lorem Ipsum |
| QR 码生成器 | 自定义颜色 / 尺寸 + 下载 PNG |
| 系统信息 | 平台 / 分辨率 / 时区 / UserAgent |
| 任务清单 | 优先级 + 完成状态 + 删除 |
| AI Key 设置 | DeepSeek / OpenAI API 配置 |

</details>

<details>
<summary><strong>📈 数据 & 3D（4 个）</strong></summary>

| 工具 | 功能 |
|------|------|
| 数据清洗 | 去重 / 排序 / 去空行 / 大小写转换 |
| 统计计算器 | 均值 / 中位数 / 标准差 / 四分位数 / IQR |
| 正则批量替换 | 批量查找 + 替换 + 计数 |
| 3D 模型查看器 | Three.js 加载 GLTF / OBJ |

</details>

<details>
<summary><strong>🎨 设计工具（4 个）</strong></summary>

| 工具 | 功能 |
|------|------|
| 颜色转换 | HEX / RGB / HSL 实时互转 |
| 渐变生成器 | 线性 / 径向 + CSS 代码导出 |
| 阴影生成器 | Box Shadow 可视化 + CSS 导出 |
| SVG 查看器 | 代码编辑 + 实时预览 + 下载 |

</details>

## 📸 界面预览

> 深色主题 + 侧边栏分类导航 + 全局搜索

```
┌──────────────────────────────────────────────────┐
│ 🧰 工具箱          🔍 搜索工具...                  │
├──────────┬───────────────────────────────────────┤
│          │                                       │
│ 💻 Dev   │  API 调试器                           │
│   JSON   │                                       │
│   YAML   │  [GET ▾] [https://api.example.com] [发送]│
│   API    │                                       │
│   ...    │  ┌─Params─┬─Headers─┬─Body─┬─Auth─┐   │
│          │  │ Key    │ Value   │      │      │   │
│ 📝 Ops   │  │--------|---------|------|------│   │
│   MD     │  │ page   │ 1       │      │      │   │
│   ...    │  └────────┴─────────┴──────┴──────┘   │
│          │                                       │
│ 🏭 Ind   │  响应  200 OK  ⏱ 0.23s  📦 1.2KB     │
│   ...    │  ┌─────────────────────────────────┐  │
│          │  │ { "id": 1, "title": "foo" }     │  │
│          │  └─────────────────────────────────┘  │
└──────────┴───────────────────────────────────────┘
```

## 🛠️ 技术栈

```
┌─────────────────────────────────────────┐
│               Frontend                  │
│  React 18 + TypeScript + Vite           │
│  Custom CSS (Dark Theme)                │
│  react-markdown, html-to-image          │
├─────────────────────────────────────────┤
│               Backend                   │
│  Rust + Tauri 2                         │
│  tauri-plugin-shell                     │
├─────────────────────────────────────────┤
│              CI / CD                    │
│  GitHub Actions                         │
│  macOS / Windows / Linux 自动构建        │
└─────────────────────────────────────────┘
```

## 🚀 快速开始

### 📥 下载安装

从 [Releases](https://github.com/shenfangda520/toolbox/releases) 下载对应平台安装包：

| 平台 | 文件 | 格式 |
|------|------|------|
| macOS (Apple Silicon) | `Toolbox_1.0.0_aarch64.dmg` | DMG |
| macOS (Intel) | `Toolbox_1.0.0_x64.dmg` | DMG |
| Windows | `Toolbox_1.0.0_x64-setup.exe` | EXE |
| Windows | `Toolbox_1.0.0_x64_en-US.msi` | MSI |
| Linux (Debian/Ubuntu) | `Toolbox_1.0.0_amd64.deb` | DEB |
| Linux (通用) | `Toolbox_1.0.0_amd64.AppImage` | AppImage |

### 💻 从源码构建

**环境要求：**
- [Node.js](https://nodejs.org/) >= 18
- [Rust](https://rustup.rs/) (通过 rustup 安装)

```bash
# 克隆仓库
git clone https://github.com/shenfangda520/toolbox.git
cd toolbox

# 安装依赖
npm install

# 开发模式（热更新）
npm run tauri dev

# 构建发布版
npm run tauri build
```

## 📁 项目结构

```
toolbox/
├── src/
│   ├── main.tsx                  # React 入口
│   ├── App.tsx                   # 主界面 + 侧边栏导航
│   ├── categories.ts             # 6 大分类 + 工具注册中心
│   ├── index.css                 # 全局暗色主题样式
│   ├── lib/
│   │   ├── ai.ts                 # DeepSeek AI 接口封装
│   │   └── watermark.tsx         # Canvas 水印工具
│   └── tools/
│       ├── dev/                  # 开发工具 (14)
│       ├── content/              # 运营工具 (7)
│       ├── industrial/           # 工业工具 (6)
│       ├── productivity/         # 生产力工具 (7)
│       ├── data/                 # 数据 & 3D (4)
│       ├── design/               # 设计工具 (4)
│       └── settings/             # AI 设置
├── src-tauri/
│   ├── Cargo.toml                # Rust 依赖
│   ├── tauri.conf.json           # Tauri 配置
│   ├── icons/                    # 应用图标
│   └── src/main.rs               # Rust 入口
├── .github/workflows/
│   └── build.yml                 # CI: 三平台自动构建
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 🤝 贡献

欢迎贡献！以下是参与方式：

1. **Fork** 本仓库
2. **创建** 功能分支：`git checkout -b feature/amazing-tool`
3. **提交** 更改：`git commit -m 'feat: add amazing tool'`
4. **推送** 到分支：`git push origin feature/amazing-tool`
5. **创建** Pull Request

### 添加新工具

```bash
# 1. 创建工具组件
touch src/tools/dev/MyNewTool.tsx

# 2. 在 categories.ts 中注册
{
  id: "my-tool",
  name: "我的新工具",
  icon: "🔧",
  tags: ["tag1", "tag2"],
  component: lazy(() => import("./tools/dev/MyNewTool")),
}
```

## 📋 路线图

- [x] 6 大分类 34+ 工具
- [x] 深色主题 + 全局搜索
- [x] Postman 风格 API 调试器
- [x] Markdown 导出高清图片
- [x] AI 文案工作台 (DeepSeek)
- [x] 三平台自动构建 (CI/CD)
- [ ] 插件系统（社区贡献工具）
- [ ] 多语言支持 (i18n)
- [ ] 主题自定义（亮色/暗色/自定义）
- [ ] 数据持久化（收藏/历史记录）

## 📄 License

[MIT](LICENSE) © [shenfangda520](https://github.com/shenfangda520)

---

<p align="center">
  如果觉得有用，请给个 ⭐ Star 支持一下！
</p>

# 🧰 Toolbox - 开发者工具箱

一个基于 **Tauri + React + TypeScript** 的跨平台桌面工具箱，覆盖开发、运营、工业、生产力、数据、设计六大场景。

## ✨ 特性

- 🚀 **轻量高性能** — Tauri 构建，原生性能，安装包仅 ~15MB
- 🌙 **深色主题** — 默认暗色 UI，护眼舒适
- 🔍 **全局搜索** — 支持名称和标签快速定位工具
- 📂 **分类导航** — 6 大类 34+ 工具，折叠展开 + 侧边栏
- 🌐 **离线可用** — 本地优先，无需联网
- 📦 **一键导出** — DMG / App 双格式打包

## 📦 工具一览

### 💻 开发工具
| 工具 | 说明 |
|------|------|
| JSON 格式化 | 格式化、压缩、校验 |
| YAML / XML 格式化 | 格式转换与校验 |
| Base64 / URL 编解码 | 常用编解码 |
| 哈希生成 | SHA-256 / MD5 |
| 正则测试 | 正则表达式匹配测试 |
| 时间戳转换 | 秒/毫秒 ↔ 日期 |
| 文本对比 | 逐行 Diff 对比 |
| Git Commit 生成 | Conventional Commit 规范 |
| CSS Box Model | 盒模型可视化调试 |
| JWT 解析 | Header / Payload 解码 |
| Mock 数据生成 | 自定义模板批量生成 |
| Tailwind 生成器 | 点选类名，实时预览 |
| API 调试器 | Postman 风格接口调试 |

### 📝 运营工具
| 工具 | 说明 |
|------|------|
| MD 排版导出 | Markdown 渲染 + 主题 + 导出 PNG |
| 字数统计 | 中英文字符 / 词汇 / 阅读时间 |
| 社交发帖优化 | 微博 / X / LinkedIn / 小红书 / 公众号 |
| 图片压缩 | 批量 JPEG 压缩 |
| 图片水印 | 文字水印 + 位置 / 透明度 |
| 批量重命名 | 前缀 / 后缀 / 查找替换 / 变量 |

### 🏭 工业工具
| 工具 | 说明 |
|------|------|
| CSV 查看器 | 表格渲染 + 导出 |
| Hex 编辑器 | 十六进制 ↔ 文本 |
| 协议调试器 | TCP / UDP 模拟 |
| 日志解析器 | 级别过滤 + 关键词搜索 |
| 单位换算 | 温度 / 压力 / 流量 / 长度 |
| PLC 数据模拟 | DB 块读写 + 传感器模拟 |

### ⚡ 生产力
| 工具 | 说明 |
|------|------|
| 番茄计时器 | 25/5 分钟 + 进度环 |
| 密码生成器 | 自定义长度 / 字符类型 |
| 占位文本生成 | 中英文 Lorem |
| QR 码生成 | 自定义颜色 / 尺寸 |
| 系统信息 | 平台 / 分辨率 / 时区 |
| 任务清单 | 优先级 + 完成状态 |

### 📈 数据工具
| 工具 | 说明 |
|------|------|
| 数据清洗 | 去重 / 排序 / 去空行 / 大小写 |
| 统计计算器 | 均值 / 中位数 / 标准差 / 四分位 |
| 正则批量替换 | 批量查找替换 |
| 3D 模型查看器 | GLTF / OBJ 预览 |

### 🎨 设计工具
| 工具 | 说明 |
|------|------|
| 颜色转换 | HEX / RGB / HSL |
| 渐变生成器 | 线性 / 径向 + CSS 导出 |
| 阴影生成器 | Box Shadow 可视化调节 |
| SVG 查看器 | 代码编辑 + 实时预览 |

## 🛠️ 技术栈

- **前端**: React 18 + TypeScript + Vite
- **后端**: Rust (Tauri 2)
- **样式**: 自定义 CSS (暗色主题)
- **构建**: Tauri CLI + Cargo

## 🚀 快速开始

### 环境要求
- Node.js >= 18
- Rust (通过 [rustup](https://rustup.rs/) 安装)

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run tauri dev
```

### 构建发布版
```bash
npm run tauri build
```

构建产物位于：
- **macOS**: `src-tauri/target/release/bundle/macos/Toolbox.app`
- **DMG**: `src-tauri/target/release/bundle/dmg/`

## 📁 项目结构

```
toolbox/
├── src/
│   ├── main.tsx              # 入口
│   ├── App.tsx               # 主界面 + 导航
│   ├── index.css             # 全局样式
│   ├── categories.ts         # 分类 + 工具注册
│   ├── lib/                  # 工具函数
│   └── tools/
│       ├── dev/              # 开发工具
│       ├── content/          # 运营工具
│       ├── industrial/       # 工业工具
│       ├── productivity/     # 生产力工具
│       ├── data/             # 数据工具
│       └── design/           # 设计工具
├── src-tauri/
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   └── src/main.rs
└── package.json
```

## 📄 License

MIT

# 🤝 Contributing to Toolbox

感谢你对 Toolbox 的关注！以下是参与贡献的完整指南。

## 🚀 快速开始

```bash
# 1. Fork 并克隆
git clone https://github.com/your-username/toolbox.git
cd toolbox

# 2. 安装依赖
npm install

# 3. 启动开发模式
npm run tauri dev
```

## 📁 项目结构

```
src/tools/
├── dev/              # 开发工具
├── content/          # 运营工具
├── industrial/       # 工业工具
├── productivity/     # 生产力工具
├── data/             # 数据工具
└── design/           # 设计工具
```

## 🔧 添加新工具

### 1. 创建组件

```tsx
// src/tools/dev/MyNewTool.tsx
import { useState } from "react";

export default function MyNewTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  return (
    <div className="tool-section">
      <div className="tool-row">
        <div className="tool-col">
          <label>输入</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} />
        </div>
        <div className="tool-col">
          <label>输出</label>
          <div className="result-box">{output}</div>
        </div>
      </div>
      <div className="btn-group">
        <button className="btn btn-primary" onClick={() => setOutput(input.toUpperCase())}>
          处理
        </button>
      </div>
    </div>
  );
}
```

### 2. 注册工具

```ts
// src/categories.ts
{
  id: "my-tool",
  name: "我的新工具",
  icon: "🔧",
  tags: ["my", "tool", "标签"],
  component: lazy(() => import("./tools/dev/MyNewTool")),
}
```

### 3. 验证

```bash
npx tsc --noEmit     # 类型检查
npm run build        # 构建验证
```

## 📐 代码规范

- **组件**: 函数式组件 + Hooks
- **样式**: 使用全局 CSS 变量（`var(--accent)`, `var(--bg-card)` 等）
- **命名**: PascalCase 组件名，camelCase 变量
- **导出**: 每个工具一个文件，默认导出

## 🐛 提交 Issue

请包含：
- 操作系统版本
- 重现步骤
- 期望行为 vs 实际行为
- 截图（如适用）

## 📬 Pull Request

1. 从 `master` 创建分支
2. 一个 PR 对应一个功能/修复
3. 确保 `npm run build` 通过
4. 更新 README（如添加新工具）

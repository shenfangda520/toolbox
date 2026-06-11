import { lazy } from "react";

export type ToolDef = {
  id: string;
  name: string;
  icon: string;
  component: React.LazyExoticComponent<React.ComponentType>;
  tags: string[];
};

export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
  tools: ToolDef[];
};

export const categories: Category[] = [
  {
    id: "dev",
    name: "Development",
    icon: "⌘",
    color: "#37A5FF",
    tools: [
      { id: "json", name: "JSON 格式化", icon: "{ }", tags: ["json", "格式化", "校验", "压缩"], component: lazy(() => import("./tools/dev/JsonFormatter")) },
      { id: "base64", name: "Base64 编解码", icon: "B64", tags: ["base64", "编码", "解码", "加密"], component: lazy(() => import("./tools/dev/Base64Tool")) },
      { id: "url", name: "URL 编解码", icon: "URL", tags: ["url", "编码", "解码", "percent"], component: lazy(() => import("./tools/dev/UrlEncoder")) },
      { id: "hash", name: "哈希生成", icon: "#", tags: ["hash", "sha256", "md5", "加密"], component: lazy(() => import("./tools/dev/HashGenerator")) },
      { id: "regex", name: "正则测试", icon: ".*", tags: ["regex", "正则", "匹配", "表达式"], component: lazy(() => import("./tools/dev/RegexTester")) },
      { id: "timestamp", name: "时间戳转换", icon: "⏱", tags: ["timestamp", "时间戳", "日期", "转换"], component: lazy(() => import("./tools/dev/TimestampConverter")) },
      { id: "text-diff", name: "文本对比", icon: "↔", tags: ["diff", "对比", "文本", "差异"], component: lazy(() => import("./tools/dev/TextDiff")) },
      { id: "yaml", name: "YAML 格式化", icon: "Y", tags: ["yaml", "格式化", "转换"], component: lazy(() => import("./tools/dev/YamlFormatter")) },
      { id: "xml", name: "XML 格式化", icon: "<>", tags: ["xml", "格式化", "校验"], component: lazy(() => import("./tools/dev/XmlFormatter")) },
      { id: "git", name: "Git Commit 生成", icon: "Git", tags: ["git", "commit", "消息", "conventional"], component: lazy(() => import("./tools/dev/GitCommitGenerator")) },
      { id: "css-box", name: "CSS Box Model", icon: "□", tags: ["css", "box", "model", "盒模型", "调试"], component: lazy(() => import("./tools/dev/CssBoxModel")) },
      { id: "jwt", name: "JWT 解析", icon: "JT", tags: ["jwt", "token", "解析", "验证"], component: lazy(() => import("./tools/dev/JwtParser")) },
      { id: "api-mock", name: "Mock 数据生成", icon: "MO", tags: ["mock", "api", "假数据", "json"], component: lazy(() => import("./tools/dev/MockDataGenerator")) },
      { id: "tailwind", name: "Tailwind 类选择器", icon: "TW", tags: ["tailwind", "css", "类", "生成"], component: lazy(() => import("./tools/dev/TailwindGenerator")) },
      { id: "api-debug", name: "API 调试器", icon: "⚡", tags: ["api", "调试", "接口", "请求", "http"], component: lazy(() => import("./tools/dev/ApiDebugger")) },
    ],
  },
  {
    id: "content",
    name: "Content Ops",
    icon: "✦",
    color: "#37F5C5",
    tools: [
      { id: "ai-settings", name: "AI Key 设置", icon: "Key", tags: ["ai", "key", "deepseek", "openai", "设置", "模型"], component: lazy(() => import("./tools/settings/AiSettings")) },
      { id: "ai-content", name: "AI 文案工作台", icon: "AI", tags: ["ai", "deepseek", "openai", "文案", "润色", "总结", "翻译", "标题", "简历"], component: lazy(() => import("./tools/content/AiContentStudio")) },
      { id: "multi-publish", name: "多平台发布", icon: "发", tags: ["公众号", "小红书", "微博", "twitter", "x", "发布", "排版", "markdown", "导出图片"], component: lazy(() => import("./tools/content/MultiPlatformPublisher")) },
      { id: "markdown", name: "MD 排版导出", icon: "M↓", tags: ["markdown", "排版", "导出", "图片"], component: lazy(() => import("./tools/content/MarkdownExport")) },
      { id: "word-count", name: "字数统计", icon: "W", tags: ["字数", "统计", "阅读时间", "seo", "简历"], component: lazy(() => import("./tools/content/WordCounter")) },
      { id: "social-post", name: "发帖字数检查", icon: "S", tags: ["社交", "发帖", "字数", "限制", "微博", "twitter", "hashtag"], component: lazy(() => import("./tools/content/SocialPostOptimizer")) },
      { id: "image-compress", name: "图片压缩", icon: "IC", tags: ["图片", "压缩", "批量", "png", "jpg"], component: lazy(() => import("./tools/content/ImageCompressor")) },
      { id: "watermark", name: "图片水印", icon: "WM", tags: ["水印", "图片", "批量", "文字"], component: lazy(() => import("./tools/content/WatermarkTool")) },
      { id: "batch-rename", name: "批量重命名", icon: "RN", tags: ["批量", "重命名", "文件", "图片"], component: lazy(() => import("./tools/content/BatchRenamer")) },
    ],
  },
  {
    id: "design",
    name: "Design",
    icon: "◑",
    color: "#F5D06F",
    tools: [
      { id: "color", name: "颜色转换", icon: "◉", tags: ["颜色", "hex", "rgb", "hsl", "转换"], component: lazy(() => import("./tools/design/ColorConverter")) },
      { id: "gradient", name: "渐变生成器", icon: "↯", tags: ["渐变", "gradient", "css", "生成"], component: lazy(() => import("./tools/design/GradientGenerator")) },
      { id: "shadow-gen", name: "阴影生成器", icon: "░", tags: ["阴影", "shadow", "css", "box-shadow"], component: lazy(() => import("./tools/design/ShadowGenerator")) },
      { id: "svg-viewer", name: "SVG 预览器", icon: "SVG", tags: ["svg", "预览", "矢量", "代码"], component: lazy(() => import("./tools/design/SvgViewer")) },
    ],
  },
  {
    id: "productivity",
    name: "Productivity & Moyu",
    icon: "◒",
    color: "#7CFFB2",
    tools: [
      { id: "pomodoro", name: "番茄计时器", icon: "25", tags: ["番茄", "计时", "专注", "pomodoro"], component: lazy(() => import("./tools/productivity/PomodoroTimer")) },
      { id: "todo", name: "任务清单", icon: "✓", tags: ["任务", "清单", "待办", "todo"], component: lazy(() => import("./tools/productivity/TodoList")) },
      { id: "password", name: "密码生成器", icon: "Key", tags: ["密码", "生成", "安全", "随机"], component: lazy(() => import("./tools/productivity/PasswordGenerator")) },
      { id: "qr-code", name: "QR 码生成", icon: "▦", tags: ["qr", "二维码", "条形码", "生成"], component: lazy(() => import("./tools/productivity/QrCodeGenerator")) },
      { id: "lorem", name: "占位文本生成", icon: "P", tags: ["lorem", "占位", "文本", "生成"], component: lazy(() => import("./tools/productivity/LoremGenerator")) },
      { id: "sys-info", name: "运行环境信息", icon: "i", tags: ["环境", "浏览器", "分辨率", "时区", "信息"], component: lazy(() => import("./tools/productivity/SysInfo")) },
    ],
  },
  {
    id: "data",
    name: "Data Tools",
    icon: "▧",
    color: "#A78BFA",
    tools: [
      { id: "data-clean", name: "数据清洗", icon: "🧹", tags: ["数据", "清洗", "去重", "格式化"], component: lazy(() => import("./tools/data/DataCleaner")) },
      { id: "stat-calc", name: "统计计算器", icon: "Σ", tags: ["统计", "计算", "均值", "标准差"], component: lazy(() => import("./tools/data/StatCalculator")) },
      { id: "regex-replace", name: "正则批量替换", icon: "R→", tags: ["正则", "替换", "批量", "文本"], component: lazy(() => import("./tools/data/RegexReplacer")) },
      { id: "csv-viewer", name: "CSV 查看器", icon: "CSV", tags: ["csv", "查看", "数据", "表格"], component: lazy(() => import("./tools/industrial/CsvViewer")) },
      { id: "model-viewer", name: "3D 模型查看器", icon: "3D", tags: ["3d", "模型", "上传", "glb", "obj", "stl", "预览", "可视化"], component: lazy(() => import("./tools/data/ModelViewer")) },
    ],
  },
  {
    id: "industrial",
    name: "Industrial",
    icon: "⚙",
    color: "#FF9B6B",
    tools: [
      { id: "plc-simulator", name: "PLC 数据模拟", icon: "PL", tags: ["plc", "模拟", "传感器", "数据", "工业"], component: lazy(() => import("./tools/industrial/PlcSimulator")) },
      { id: "protocol-debug", name: "协议调试（模拟）", icon: "TCP", tags: ["协议", "调试", "模拟", "modbus", "tcp"], component: lazy(() => import("./tools/industrial/ProtocolDebugger")) },
      { id: "log-parser", name: "日志解析器", icon: "LOG", tags: ["日志", "解析", "过滤", "搜索"], component: lazy(() => import("./tools/industrial/LogParser")) },
      { id: "hex-editor", name: "Hex 转换", icon: "0x", tags: ["hex", "十六进制", "转换", "字节"], component: lazy(() => import("./tools/industrial/HexEditor")) },
      { id: "unit-convert", name: "单位换算", icon: "↔", tags: ["单位", "换算", "温度", "压力", "流量"], component: lazy(() => import("./tools/industrial/UnitConverter")) },
    ],
  },
];

export function getAllTools(): (ToolDef & { category: string })[] {
  return categories.flatMap((c) =>
    c.tools.map((t) => ({ ...t, category: c.id }))
  );
}

export function searchTools(query: string): (ToolDef & { category: string })[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return getAllTools().filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.toLowerCase().includes(q))
  );
}

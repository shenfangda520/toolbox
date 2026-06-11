import { Suspense, useMemo, useState } from "react";
import { Category, categories, getAllTools, searchTools, ToolDef } from "./categories";

type Screen = "dashboard" | string;

const navIcons: Record<string, string> = {
  dev: "⌘",
  content: "✦",
  productivity: "◒",
  job: "↗",
  life: "◌",
  data: "▧",
  industrial: "⚙",
};

const featuredTools = ["ai-content", "ai-settings", "pomodoro", "markdown", "plc-simulator", "model-viewer"];

const systemMetrics = [
  { label: "Flow State", value: "92%", tone: "cyan" },
  { label: "Twin Signals", value: "1.2k", tone: "green" },
  { label: "Draft Velocity", value: "18", tone: "blue" },
  { label: "Moyu Balance", value: "Calm", tone: "lime" },
];

function ToolLoader() {
  return (
    <div className="loading-state">
      <div className="loading-orbit" />
      <span>Hydrating workspace...</span>
    </div>
  );
}

function IconMark({ value }: { value: string }) {
  return <span className="icon-mark">{value}</span>;
}

function DesignSystemPanel() {
  const colorTokens = [
    ["Deep Space", "#0A0A0A"],
    ["Panel Glass", "#111827"],
    ["Electric Blue", "#37A5FF"],
    ["Cyan Green", "#37F5C5"],
    ["Soft Text", "#E8F1FF"],
  ];

  return (
    <section className="design-system-panel">
      <div className="section-heading">
        <span className="eyebrow">Design System</span>
        <h3>Glass, glow, calm precision</h3>
      </div>
      <div className="system-grid">
        <div className="system-block">
          <h4>Color</h4>
          <p>深空黑为底，蓝到青绿渐变作为状态、焦点和主行动。边框以 8-12% 白色透明度建立层级。</p>
          <div className="swatch-row">
            {colorTokens.map(([name, color]) => (
              <span key={name} className="swatch" title={name} style={{ background: color }} />
            ))}
          </div>
        </div>
        <div className="system-block">
          <h4>Shape</h4>
          <p>组件圆角 12-16px；工具卡片 18px；侧边栏与浮层使用 24px 大圆角表达桌面级柔和感。</p>
        </div>
        <div className="system-block">
          <h4>Motion</h4>
          <p>150-260ms ease-out，hover 轻微上浮 2px，当前页使用微光扫描和边框色温变化。</p>
        </div>
        <div className="system-block">
          <h4>Spacing</h4>
          <p>8px 基础栅格，主内容 24-32px 留白，卡片内部 18-24px，工具表单保持紧凑可扫读。</p>
        </div>
      </div>
    </section>
  );
}

function Dashboard({
  onOpenTool,
  allTools,
}: {
  onOpenTool: (id: string) => void;
  allTools: (ToolDef & { category: string })[];
}) {
  const featured = featuredTools
    .map((id) => allTools.find((tool) => tool.id === id))
    .filter(Boolean) as (ToolDef & { category: string })[];

  return (
    <div className="dashboard-view">
      <section className="hero-surface">
        <div className="hero-copy">
          <span className="eyebrow">Fangda Toolbox</span>
          <h1>Developer cockpit for digital twins, content ops, and elegant moyu.</h1>
          <p>
            一个跨平台桌面工具箱外壳：高密度开发工具、工业信号模拟、创作者工作台和放松生产力状态，统一在安静的未来感界面里。
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => onOpenTool("ai-content")}>Open AI Studio</button>
            <button className="btn btn-secondary" onClick={() => onOpenTool("ai-settings")}>Set AI Key</button>
          </div>
        </div>
        <div className="twin-visual" aria-label="Industrial digital twin signal preview">
          <div className="grid-plane" />
          <div className="signal-ring ring-one" />
          <div className="signal-ring ring-two" />
          <div className="core-node">
            <span>FD</span>
          </div>
          <div className="telemetry-chip chip-a">PLC 1Hz</div>
          <div className="telemetry-chip chip-b">Render 60fps</div>
          <div className="telemetry-chip chip-c">Moyu Safe</div>
        </div>
      </section>

      <section className="metric-grid">
        {systemMetrics.map((metric) => (
          <div className={`metric-card tone-${metric.tone}`} key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
          </div>
        ))}
      </section>

      <section className="quick-section">
        <div className="section-heading">
          <span className="eyebrow">Quick Entry</span>
          <h2>常用工具</h2>
        </div>
        <div className="quick-grid">
          {featured.map((tool) => (
            <button className="tool-card" key={tool.id} onClick={() => onOpenTool(tool.id)}>
              <IconMark value={tool.icon} />
              <span className="tool-card-title">{tool.name}</span>
              <span className="tool-card-meta">{tool.tags.slice(0, 3).join(" · ")}</span>
            </button>
          ))}
        </div>
      </section>

      <DesignSystemPanel />

      <section className="page-descriptions">
        <div className="section-heading">
          <span className="eyebrow">High Fidelity Pages</span>
          <h2>关键页面画面描述</h2>
        </div>
        <div className="description-list">
          <p><strong>首页仪表盘</strong>：左侧深色玻璃导航，顶部全局搜索悬浮在主画布；首屏是数字孪生雷达视觉、状态指标和快速入口卡片，摸鱼模式用 Calm/Focus 切换表达。</p>
          <p><strong>Pomodoro</strong>：中心圆形进度环带青蓝辉光，工作/休息为分段控件，底部展示完成次数与轻量状态，不制造压迫感。</p>
          <p><strong>Markdown 编辑器</strong>：左右分栏，左侧代码输入、右侧出版预览，顶部控制条像 Figma 属性栏，导出按钮为主行动。</p>
          <p><strong>PLC 模拟器</strong>：表格采用工业监控台视觉，地址和值使用等宽字体，高亮实时变化数据，日志区像低噪声终端。</p>
          <p><strong>3D 模型查看器</strong>：全屏黑色查看口，旋转的发光线框模型与参数面板同屏，适合后续接入真实模型格式。</p>
        </div>
      </section>
    </div>
  );
}

function Sidebar({
  activeScreen,
  collapsed,
  searchQuery,
  setSearchQuery,
  onOpenTool,
  onOpenDashboard,
  onToggleCollapsed,
  searchResults,
}: {
  activeScreen: Screen;
  collapsed: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenTool: (id: string) => void;
  onOpenDashboard: () => void;
  onToggleCollapsed: () => void;
  searchResults: (ToolDef & { category: string })[];
}) {
  return (
    <aside className={`sidebar ${collapsed ? "is-collapsed" : ""}`}>
      <div className="brand-row">
        <button className="brand-mark" onClick={onOpenDashboard} title="Dashboard">F</button>
        {!collapsed && (
          <div className="brand-copy">
            <strong>Fangda Toolbox</strong>
            <span>Industrial creator cockpit</span>
          </div>
        )}
        <button className="collapse-btn" onClick={onToggleCollapsed} title={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
          {collapsed ? "›" : "‹"}
        </button>
      </div>

      {!collapsed && (
        <div className="sidebar-search">
          <span>⌕</span>
          <input
            type="text"
            placeholder="Search tools, workflows, commands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <kbd>⌘K</kbd>
        </div>
      )}

      <nav className="sidebar-nav">
        <button className={`nav-item ${activeScreen === "dashboard" ? "active" : ""}`} onClick={onOpenDashboard}>
          <IconMark value="⌂" />
          {!collapsed && <span className="nav-label">Home Dashboard</span>}
        </button>

        {searchQuery && !collapsed ? (
          <div className="search-results">
            {searchResults.length === 0 ? (
              <div className="search-empty">No matching tools</div>
            ) : (
              searchResults.map((tool) => (
                <button
                  key={tool.id}
                  className={`nav-item ${activeScreen === tool.id ? "active" : ""}`}
                  onClick={() => onOpenTool(tool.id)}
                >
                  <IconMark value={tool.icon} />
                  <span className="nav-label">{tool.name}</span>
                </button>
              ))
            )}
          </div>
        ) : (
          categories.map((cat) => (
            <div className="category-group" key={cat.id}>
              {!collapsed && (
                <div className="category-kicker">
                  <span>{cat.name}</span>
                  <em>{cat.tools.length}</em>
                </div>
              )}
              {cat.tools.slice(0, collapsed ? 5 : undefined).map((tool) => (
                <button
                  key={tool.id}
                  className={`nav-item ${activeScreen === tool.id ? "active" : ""}`}
                  onClick={() => onOpenTool(tool.id)}
                  title={tool.name}
                >
                  <IconMark value={tool.icon || navIcons[cat.id] || "·"} />
                  {!collapsed && <span className="nav-label">{tool.name}</span>}
                </button>
              ))}
            </div>
          ))
        )}
      </nav>
    </aside>
  );
}

function ToolHeader({ currentTool, currentCategory }: { currentTool: ToolDef; currentCategory?: Category }) {
  return (
    <div className="tool-header">
      <div>
        <span className="tool-category-badge" style={{ color: currentCategory?.color }}>
          {currentCategory?.name || "Tool"}
        </span>
        <h2>{currentTool.name}</h2>
      </div>
      <div className="tool-header-actions">
        <button className="ghost-icon" title="Pin tool">⌖</button>
        <button className="ghost-icon" title="More actions">···</button>
      </div>
    </div>
  );
}

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const allTools = useMemo(() => getAllTools(), []);
  const searchResults = useMemo(() => searchTools(searchQuery), [searchQuery]);

  const current = useMemo(() => {
    for (const cat of categories) {
      const tool = cat.tools.find((item) => item.id === activeScreen);
      if (tool) return { tool, category: cat };
    }
    return null;
  }, [activeScreen]);

  const openTool = (id: string) => {
    setActiveScreen(id);
    setSearchQuery("");
  };

  const ActiveComponent = current?.tool.component;

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <Sidebar
        activeScreen={activeScreen}
        collapsed={collapsed}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenTool={openTool}
        onOpenDashboard={() => {
          setActiveScreen("dashboard");
          setSearchQuery("");
        }}
        onToggleCollapsed={() => setCollapsed((value) => !value)}
        searchResults={searchResults}
      />

      <main className="main-content">
        <header className="topbar">
          <div className="global-search">
            <span>⌕</span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Fangda Toolbox..."
            />
            <kbd>⌘K</kbd>
          </div>
          <div className="mode-switch" aria-label="Moyu mode switch">
            <span>Focus</span>
            <button className="switch-track" title="Moyu mode">
              <i />
            </button>
            <span>Moyu</span>
          </div>
        </header>

        <div className="content-frame">
          {activeScreen === "dashboard" ? (
            <Dashboard onOpenTool={openTool} allTools={allTools} />
          ) : current && ActiveComponent ? (
            <>
              <ToolHeader currentTool={current.tool} currentCategory={current.category} />
              <div className="tool-body">
                <Suspense fallback={<ToolLoader />}>
                  <ActiveComponent />
                </Suspense>
              </div>
            </>
          ) : (
            <Dashboard onOpenTool={openTool} allTools={allTools} />
          )}
        </div>
      </main>
    </div>
  );
}

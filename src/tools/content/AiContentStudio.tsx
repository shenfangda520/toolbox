import { useMemo, useState } from "react";
import { loadAiSettings, maskApiKey, runAiCompletion } from "../../lib/ai";

type TaskKey = "polish" | "rewrite" | "summarize" | "social" | "title" | "translate";

const taskPrompts: Record<TaskKey, { label: string; hint: string; system: string; userPrefix: string }> = {
  polish: {
    label: "润色增强",
    hint: "让语气更清晰、更高级",
    system: "你是一位顶级中文商业文案编辑。保持原意，提升表达质量，去掉啰嗦、空泛和过度营销感。",
    userPrefix: "请润色以下文案，输出更清晰、更高级但不过度夸张的版本：",
  },
  rewrite: {
    label: "改写扩写",
    hint: "换一种更有传播感的表达",
    system: "你是一位懂技术产品、工业数字化和内容传播的文案策略师。请重写文案，使其更有结构和阅读节奏。",
    userPrefix: "请改写并适度扩写以下内容：",
  },
  summarize: {
    label: "总结提炼",
    hint: "提取重点、结论、行动项",
    system: "你是一位严谨的信息架构师。请把输入内容总结为要点、结论和下一步行动。",
    userPrefix: "请总结以下内容：",
  },
  social: {
    label: "社媒发布",
    hint: "生成适合 X/小红书/公众号的版本",
    system: "你是一位社媒增长编辑。请把内容改造成更适合发布的文案，保留可信度，避免廉价标题党。",
    userPrefix: "请把以下内容改造成社媒发布文案，并给出 3 个标题：",
  },
  title: {
    label: "标题生成",
    hint: "生成 8 个标题方向",
    system: "你是一位标题编辑。请生成克制、有点击欲、不过度夸张的标题。",
    userPrefix: "请基于以下内容生成 8 个标题，并标注适合的平台：",
  },
  translate: {
    label: "中英互译",
    hint: "技术语境自然翻译",
    system: "你是一位精通中英文技术写作的翻译。翻译要自然、准确、适合开发者和产品语境。",
    userPrefix: "请翻译以下内容；如果是中文翻译成英文，如果是英文翻译成中文：",
  },
};

const sampleText = "Fangda Toolbox 是一个跨平台桌面工具箱，服务开发者、工业数字孪生、内容创作者和居家摸鱼生产力场景。它希望像 Linear 一样高效，像 Arc 一样轻盈，也像 Figma 一样让人愿意长时间使用。";

export default function AiContentStudio() {
  const [task, setTask] = useState<TaskKey>("polish");
  const [input, setInput] = useState(sampleText);
  const [extraPrompt, setExtraPrompt] = useState("语气：专业、轻松、有未来感；输出中文。");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [settingsSnapshot, setSettingsSnapshot] = useState(() => loadAiSettings());

  const currentTask = taskPrompts[task];
  const keyStatus = useMemo(() => maskApiKey(settingsSnapshot.apiKey), [settingsSnapshot.apiKey]);

  const refreshSettings = () => {
    setSettingsSnapshot(loadAiSettings());
  };

  const run = async () => {
    setLoading(true);
    setError("");
    setOutput("");
    refreshSettings();

    const latestSettings = loadAiSettings();
    try {
      const result = await runAiCompletion(latestSettings, [
        {
          role: "system",
          content: `${currentTask.system}\n输出要求：结构清晰，必要时使用短标题和项目符号，不要解释你正在做什么。`,
        },
        {
          role: "user",
          content: `${currentTask.userPrefix}\n\n${input}\n\n补充要求：${extraPrompt || "无"}`,
        },
      ]);
      setOutput(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI 请求失败，请检查配置。");
    } finally {
      setLoading(false);
      setSettingsSnapshot(latestSettings);
    }
  };

  return (
    <div className="tool-section ai-studio">
      <section className="ai-workbench-header">
        <div>
          <span className="eyebrow">AI Content Studio</span>
          <h3>DeepSeek 驱动的文案处理工作台</h3>
          <p>适合润色产品文案、生成社媒内容、总结文章、做中英技术写作转换。</p>
        </div>
        <div className="ai-status-card">
          <span>{settingsSnapshot.provider}</span>
          <strong>{settingsSnapshot.model}</strong>
          <em>{keyStatus}</em>
        </div>
      </section>

      <div className="ai-task-grid">
        {(Object.entries(taskPrompts) as [TaskKey, typeof taskPrompts[TaskKey]][]).map(([key, item]) => (
          <button key={key} className={`ai-task-card ${task === key ? "active" : ""}`} onClick={() => setTask(key)}>
            <strong>{item.label}</strong>
            <span>{item.hint}</span>
          </button>
        ))}
      </div>

      <div className="tool-row ai-editor-row">
        <div className="tool-col">
          <label>原始内容</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="粘贴需要处理的文案、文章、简历段落或社媒草稿..." />
        </div>
        <div className="tool-col">
          <label>AI 输出</label>
          <div className="result-box ai-output-box">
            {loading ? "AI 正在处理..." : error ? <span className="error">{error}</span> : output || "选择任务并点击 Run AI。"}
          </div>
        </div>
      </div>

      <div className="tool-col" style={{ flex: "none" }}>
        <label>补充要求</label>
        <input type="text" value={extraPrompt} onChange={(e) => setExtraPrompt(e.target.value)} />
      </div>

      <div className="btn-group">
        <button className="btn btn-primary" onClick={run} disabled={loading || !input.trim()}>
          {loading ? "Running..." : "Run AI"}
        </button>
        <button className="btn btn-secondary" onClick={() => navigator.clipboard.writeText(output)} disabled={!output}>复制结果</button>
        <button className="btn btn-secondary" onClick={refreshSettings}>刷新配置</button>
      </div>
    </div>
  );
}

import { useMemo, useState } from "react";
import { AiProvider, AiSettings as AiSettingsType, defaultAiSettings, loadAiSettings, maskApiKey, providerPresets, saveAiSettings } from "../../lib/ai";

const providerLabels: Record<AiProvider, string> = {
  deepseek: "DeepSeek",
  openai: "OpenAI",
  custom: "Custom Compatible",
};

export default function AiSettings() {
  const [settings, setSettings] = useState<AiSettingsType>(() => loadAiSettings());
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  const status = useMemo(() => maskApiKey(settings.apiKey), [settings.apiKey]);

  const update = <K extends keyof AiSettingsType>(key: K, value: AiSettingsType[K]) => {
    setSaved(false);
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const switchProvider = (provider: AiProvider) => {
    const preset = providerPresets[provider];
    setSaved(false);
    setSettings((prev) => ({
      ...prev,
      provider,
      baseUrl: preset.baseUrl,
      model: preset.model,
    }));
  };

  const save = () => {
    saveAiSettings(settings);
    setSaved(true);
  };

  const reset = () => {
    setSettings(defaultAiSettings);
    saveAiSettings(defaultAiSettings);
    setSaved(true);
  };

  return (
    <div className="tool-section ai-settings-page">
      <section className="ai-hero-panel">
        <div>
          <span className="eyebrow">AI Gateway</span>
          <h3>本地保存你的 DeepSeek / OpenAI-compatible 配置</h3>
          <p>API Key 仅保存到当前设备的 localStorage。文案工作台会读取这里的配置，不会把 Key 写入代码文件。</p>
        </div>
        <div className="ai-status-card">
          <span>Current key</span>
          <strong>{status}</strong>
        </div>
      </section>

      <div className="ai-form-grid">
        <div className="tool-col">
          <label>Provider</label>
          <select value={settings.provider} onChange={(e) => switchProvider(e.target.value as AiProvider)}>
            {Object.entries(providerLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <div className="tool-col">
          <label>Model</label>
          <input type="text" value={settings.model} onChange={(e) => update("model", e.target.value)} placeholder="deepseek-chat" />
        </div>
        <div className="tool-col">
          <label>Temperature {settings.temperature}</label>
          <input type="range" min={0} max={1.5} step={0.1} value={settings.temperature} onChange={(e) => update("temperature", Number(e.target.value))} />
        </div>
      </div>

      <div className="tool-col">
        <label>Base URL</label>
        <input type="text" value={settings.baseUrl} onChange={(e) => update("baseUrl", e.target.value)} placeholder="https://api.deepseek.com/v1" />
      </div>

      <div className="tool-col">
        <label>API Key</label>
        <div className="secret-input-row">
          <input
            type={showKey ? "text" : "password"}
            value={settings.apiKey}
            onChange={(e) => update("apiKey", e.target.value)}
            placeholder="sk-..."
          />
          <button className="btn btn-secondary" onClick={() => setShowKey((value) => !value)}>
            {showKey ? "隐藏" : "显示"}
          </button>
        </div>
      </div>

      <div className="btn-group">
        <button className="btn btn-primary" onClick={save}>保存 AI 配置</button>
        <button className="btn btn-secondary" onClick={reset}>重置为 DeepSeek</button>
        {saved && <span className="inline-success">配置已保存</span>}
      </div>

      <div className="description-list">
        <p><strong>DeepSeek</strong>：Provider 选择 DeepSeek，填入 Key 后默认使用 <code>deepseek-chat</code>。</p>
        <p><strong>自定义服务</strong>：选择 Custom Compatible 后填入任意兼容 OpenAI Chat Completions 的 Base URL 与模型名。</p>
        <p><strong>隐私提示</strong>：调用 AI 时，输入文案会发送到你配置的服务商；请不要粘贴不希望发送到外部服务的敏感内容。</p>
      </div>
    </div>
  );
}

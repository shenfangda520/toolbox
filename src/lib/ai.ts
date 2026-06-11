export type AiProvider = "deepseek" | "openai" | "custom";

export type AiSettings = {
  provider: AiProvider;
  apiKey: string;
  baseUrl: string;
  model: string;
  temperature: number;
};

export type AiMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

const STORAGE_KEY = "fangda-toolbox-ai-settings";

export const providerPresets: Record<AiProvider, Pick<AiSettings, "baseUrl" | "model">> = {
  deepseek: {
    baseUrl: "https://api.deepseek.com/v1",
    model: "deepseek-chat",
  },
  openai: {
    baseUrl: "https://api.openai.com/v1",
    model: "gpt-4o-mini",
  },
  custom: {
    baseUrl: "https://api.deepseek.com/v1",
    model: "deepseek-chat",
  },
};

export const defaultAiSettings: AiSettings = {
  provider: "deepseek",
  apiKey: "",
  baseUrl: providerPresets.deepseek.baseUrl,
  model: providerPresets.deepseek.model,
  temperature: 0.7,
};

export function loadAiSettings(): AiSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultAiSettings;
    return { ...defaultAiSettings, ...JSON.parse(raw) };
  } catch {
    return defaultAiSettings;
  }
}

export function saveAiSettings(settings: AiSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function maskApiKey(apiKey: string) {
  if (!apiKey) return "未设置";
  if (apiKey.length <= 10) return "已设置";
  return `${apiKey.slice(0, 6)}...${apiKey.slice(-4)}`;
}

export async function runAiCompletion(settings: AiSettings, messages: AiMessage[]) {
  if (!settings.apiKey.trim()) {
    throw new Error("请先在 AI Settings 中设置 API Key。");
  }

  const endpoint = `${settings.baseUrl.replace(/\/$/, "")}/chat/completions`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${settings.apiKey.trim()}`,
    },
    body: JSON.stringify({
      model: settings.model.trim(),
      messages,
      temperature: settings.temperature,
      stream: false,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`AI 请求失败：${response.status} ${response.statusText}${detail ? `\n${detail.slice(0, 500)}` : ""}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error("AI 返回为空，请检查模型名称或服务商响应。");
  return String(content).trim();
}

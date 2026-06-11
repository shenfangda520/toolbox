import { useState } from "react";

const platforms = {
  weibo: { name: "微博", maxLen: 2000, tips: ["#话题#", "@用户名", "表情"], examples: ["分享一个好用的开发工具 🛠️", "#前端开发# 推荐这个工具箱"] },
  twitter: { name: "X/Twitter", maxLen: 280, tips: ["#Hashtag", "🧵 线程", "📊 投票"], examples: ["Just shipped a new dev toolbox! 🧰", "Thread: 10 tools every developer needs 🧵"] },
  linkedin: { name: "LinkedIn", maxLen: 3000, tips: ["开头钩子", "分段落", "结尾CTA"], examples: ["Excited to share my latest project...", "Key takeaways from building this tool:"] },
  xiaohongshu: { name: "小红书", maxLen: 1000, tips: ["标题要吸引人", "分段+emoji", "话题标签"], examples: ["开发者必备的效率工具合集！💻✨", "这个工具箱真的太好用了，分享给大家~"] },
  gongzhonghao: { name: "公众号", maxLen: 50000, tips: ["标题党", "开头3秒抓住读者", "排版美观"], examples: ["【干货】开发者必备的10个效率工具", "你还在手动格式化JSON？试试这个工具"] },
};

export default function SocialPostOptimizer() {
  const [platform, setPlatform] = useState<keyof typeof platforms>("twitter");
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const p = platforms[platform];

  const optimize = () => {
    const remaining = p.maxLen - text.length;
    let output = `📱 平台: ${p.name}\n📏 字数: ${text.length}/${p.maxLen} (${remaining >= 0 ? `剩余 ${remaining}` : `超出 ${-remaining}`})\n\n`;
    if (text.length > p.maxLen) {
      output += `⚠️ 超出字数限制！建议:\n`;
      output += `  1. 缩短到 ${p.maxLen} 字以内\n`;
      output += `  2. 或发布为长文/线程\n\n`;
    }
    output += `💡 平台建议:\n`;
    for (const tip of p.tips) output += `  • ${tip}\n`;
    output += `\n📝 优化后的内容:\n`;
    output += text || "(输入内容后点击优化)";
    setResult(output);
  };

  return (
    <div className="tool-section">
      <div className="tool-row" style={{ flex: "none" }}>
        <div className="tool-col" style={{ flex: "none", width: 140 }}>
          <label>平台</label>
          <select value={platform} onChange={(e) => setPlatform(e.target.value as keyof typeof platforms)}>
            {Object.entries(platforms).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
          </select>
        </div>
        <div className="tool-col">
          <label>示例模板</label>
          <select onChange={(e) => { if (e.target.value) setText(e.target.value); }}>
            <option value="">选择示例...</option>
            {p.examples.map((ex, i) => <option key={i} value={ex}>{ex.slice(0, 40)}...</option>)}
          </select>
        </div>
      </div>
      <div className="tool-row">
        <div className="tool-col">
          <label>输入内容</label>
          <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={`在${p.name}发布的内容...`} />
        </div>
        <div className="tool-col">
          <label>优化结果</label>
          <div className="result-box" style={{ whiteSpace: "pre-wrap" }}>{result}</div>
        </div>
      </div>
      <div className="btn-group">
        <button className="btn btn-primary" onClick={optimize}>分析优化</button>
        <button className="btn btn-secondary" onClick={() => navigator.clipboard.writeText(text)}>复制原文</button>
      </div>
    </div>
  );
}

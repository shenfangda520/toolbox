import { useState } from "react";

function calcStats(nums: number[]) {
  if (nums.length === 0) return null;
  const sorted = [...nums].sort((a, b) => a - b);
  const sum = nums.reduce((a, b) => a + b, 0);
  const mean = sum / nums.length;
  const variance = nums.reduce((acc, n) => acc + (n - mean) ** 2, 0) / nums.length;
  const std = Math.sqrt(variance);
  const median = nums.length % 2 === 0 ? (sorted[nums.length / 2 - 1] + sorted[nums.length / 2]) / 2 : sorted[Math.floor(nums.length / 2)];
  return {
    count: nums.length, sum, mean: +mean.toFixed(4), median, min: sorted[0], max: sorted[sorted.length - 1],
    variance: +variance.toFixed(4), std: +std.toFixed(4),
    q1: sorted[Math.floor(nums.length * 0.25)], q3: sorted[Math.floor(nums.length * 0.75)],
  };
}

export default function StatCalculator() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ReturnType<typeof calcStats>>(null);

  const calculate = () => {
    const nums = input.split(/[,\s\n]+/).map(Number).filter((n) => !isNaN(n));
    setResult(calcStats(nums));
  };

  return (
    <div className="tool-section">
      <div className="tool-col">
        <label>输入数字（逗号、空格或换行分隔）</label>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="10, 20, 30, 40, 50" />
      </div>
      <div className="btn-group">
        <button className="btn btn-primary" onClick={calculate}>计算统计</button>
      </div>
      {result && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {[
            ["样本数", result.count], ["总和", result.sum], ["均值", result.mean],
            ["中位数", result.median], ["最小值", result.min], ["最大值", result.max],
            ["方差", result.variance], ["标准差", result.std],
            ["Q1 (25%)", result.q1], ["Q3 (75%)", result.q3], ["IQR", result.q3 - result.q1],
          ].map(([label, val]) => (
            <div key={label as string} style={{ background: "var(--bg-card)", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 10, color: "var(--text-secondary)" }}>{label}</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "var(--accent)" }}>{val}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

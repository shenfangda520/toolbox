import { useState } from "react";

const loremWords = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
  "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
  "deserunt", "mollit", "anim", "id", "est", "laborum",
];

const cnWords = [
  "天地", "玄黄", "宇宙", "洪荒", "日月", "盈昃", "辰宿", "列张",
  "寒来", "暑往", "秋收", "冬藏", "闰余", "成岁", "律吕", "调阳",
  "云腾", "致雨", "露结", "为霜", "金生", "丽水", "玉出", "昆冈",
  "剑号", "巨阙", "珠称", "夜光", "果珍", "李柰", "菜重", "芥姜",
];

function generateText(wordList: string[], count: number): string {
  const sentences: string[] = [];
  for (let i = 0; i < count; i++) {
    const len = 8 + Math.floor(Math.random() * 12);
    const words: string[] = [];
    for (let j = 0; j < len; j++) {
      words.push(wordList[Math.floor(Math.random() * wordList.length)]);
    }
    sentences.push(words.join(" ") + ".");
  }
  return sentences.join("\n\n");
}

export default function LoremGenerator() {
  const [count, setCount] = useState(3);
  const [lang, setLang] = useState<"en" | "cn">("en");
  const [output, setOutput] = useState("");

  const generate = () => {
    setOutput(generateText(lang === "en" ? loremWords : cnWords, count));
  };

  return (
    <div className="tool-section">
      <div style={{ display: "flex", gap: 12, alignItems: "end" }}>
        <div className="tool-col" style={{ flex: "none", width: 120 }}>
          <label>段落数</label>
          <input type="number" value={count} onChange={(e) => setCount(Number(e.target.value))} min={1} max={50} />
        </div>
        <div className="tool-col" style={{ flex: "none", width: 120 }}>
          <label>语言</label>
          <select value={lang} onChange={(e) => setLang(e.target.value as "en" | "cn")}>
            <option value="en">English</option>
            <option value="cn">中文</option>
          </select>
        </div>
        <button className="btn btn-primary" onClick={generate}>生成</button>
      </div>
      <div className="tool-col" style={{ flex: 1 }}>
        <label>生成结果</label>
        <textarea value={output} readOnly style={{ flex: 1 }} />
      </div>
      <button className="btn btn-secondary" onClick={() => navigator.clipboard.writeText(output)}>复制</button>
    </div>
  );
}

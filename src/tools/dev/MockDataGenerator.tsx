import { useState } from "react";

const templates = {
  user: { name: "{{name}}", email: "{{email}}", age: "{{age}}", avatar: "{{avatar}}" },
  product: { id: "{{id}}", name: "{{name}}", price: "{{price}}", stock: "{{stock}}" },
  post: { id: "{{id}}", title: "{{title}}", content: "{{content}}", author: "{{author}}", date: "{{date}}" },
};

const fakerFns: Record<string, () => string> = {
  name: () => ["张三", "李四", "王五", "赵六", "钱七"][Math.floor(Math.random() * 5)],
  email: () => `user${Math.floor(Math.random() * 1000)}@example.com`,
  age: () => String(18 + Math.floor(Math.random() * 50)),
  avatar: () => `https://i.pravatar.cc/150?u=${Math.random().toString(36).slice(2)}`,
  id: () => String(Math.floor(Math.random() * 10000)),
  price: () => (Math.random() * 999).toFixed(2),
  stock: () => String(Math.floor(Math.random() * 500)),
  title: () => ["产品评测", "使用指南", "最新资讯", "深度分析"][Math.floor(Math.random() * 4)],
  content: () => "这是一段模拟的内容文本...",
  author: () => "编辑部",
  date: () => new Date().toISOString().slice(0, 10),
};

function generateItem(template: any, count: number): any {
  const result = [];
  for (let i = 0; i < count; i++) {
    const item: any = {};
    for (const [key, val] of Object.entries(template)) {
      const match = (val as string).match(/\{\{(\w+)\}\}/);
      item[key] = match ? fakerFns[match[1]]?.() || match[1] : val;
    }
    result.push(item);
  }
  return result;
}

export default function MockDataGenerator() {
  const [template, setTemplate] = useState(JSON.stringify(templates.user, null, 2));
  const [count, setCount] = useState(5);
  const [output, setOutput] = useState("");

  const generate = () => {
    try {
      const tmpl = JSON.parse(template);
      const data = generateItem(tmpl, count);
      setOutput(JSON.stringify(data, null, 2));
    } catch {
      setOutput("模板格式错误");
    }
  };

  return (
    <div className="tool-section">
      <div style={{ display: "flex", gap: 8, alignItems: "end" }}>
        <div className="tool-col" style={{ flex: "none", width: 80 }}>
          <label>数量</label>
          <input type="number" value={count} onChange={(e) => setCount(Number(e.target.value))} min={1} max={100} />
        </div>
        <div className="tool-col" style={{ flex: "none" }}>
          <label>快速模板</label>
          <select onChange={(e) => { if (e.target.value) setTemplate(JSON.stringify(templates[e.target.value as keyof typeof templates], null, 2)); }}>
            <option value="">自定义</option>
            <option value="user">用户</option>
            <option value="product">商品</option>
            <option value="post">文章</option>
          </select>
        </div>
        <button className="btn btn-primary" onClick={generate}>生成</button>
      </div>
      <div className="tool-row">
        <div className="tool-col">
          <label>模板（使用 {"{{field}}"} 占位）</label>
          <textarea value={template} onChange={(e) => setTemplate(e.target.value)} />
        </div>
        <div className="tool-col">
          <label>结果</label>
          <div className="result-box" style={{ flex: 1 }}>{output}</div>
        </div>
      </div>
      <button className="btn btn-secondary" onClick={() => navigator.clipboard.writeText(output)}>复制结果</button>
    </div>
  );
}

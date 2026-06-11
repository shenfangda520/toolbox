import { useState } from "react";

type Todo = { id: number; text: string; done: boolean; priority: "low" | "medium" | "high" };

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: "学习 React", done: false, priority: "high" },
    { id: 2, text: "完成工具箱项目", done: false, priority: "high" },
    { id: 3, text: "写技术博客", done: false, priority: "medium" },
  ]);
  const [newText, setNewText] = useState("");
  const [newPriority, setNewPriority] = useState<"low" | "medium" | "high">("medium");

  const add = () => {
    if (!newText.trim()) return;
    setTodos([...todos, { id: Date.now(), text: newText, done: false, priority: newPriority }]);
    setNewText("");
  };

  const toggle = (id: number) => setTodos(todos.map((t) => t.id === id ? { ...t, done: !t.done } : t));
  const remove = (id: number) => setTodos(todos.filter((t) => t.id !== id));

  const priorityColor = { high: "#f87171", medium: "#f59e0b", low: "#4ade80" };

  return (
    <div className="tool-section">
      <div style={{ display: "flex", gap: 8 }}>
        <input type="text" value={newText} onChange={(e) => setNewText(e.target.value)} placeholder="添加任务..." onKeyDown={(e) => e.key === "Enter" && add()} style={{ flex: 1 }} />
        <select value={newPriority} onChange={(e) => setNewPriority(e.target.value as any)} style={{ width: 90 }}>
          <option value="low">低</option><option value="medium">中</option><option value="high">高</option>
        </select>
        <button className="btn btn-primary" onClick={add}>添加</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {todos.map((todo) => (
          <div key={todo.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "var(--bg-card)", borderRadius: 6, border: "1px solid var(--border)", opacity: todo.done ? 0.5 : 1 }}>
            <input type="checkbox" checked={todo.done} onChange={() => toggle(todo.id)} style={{ accentColor: "var(--accent)" }} />
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: priorityColor[todo.priority], flexShrink: 0 }} />
            <span style={{ flex: 1, textDecoration: todo.done ? "line-through" : "none" }}>{todo.text}</span>
            <button onClick={() => remove(todo.id)} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}>✕</button>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
        共 {todos.length} 项 | 完成 {todos.filter((t) => t.done).length} 项
      </div>
    </div>
  );
}

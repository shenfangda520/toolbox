# 🧰 Toolbox - Developer Toolbox

A cross-platform desktop toolbox built with **Tauri + React + TypeScript**, covering 6 categories: Development, Content, Industrial, Productivity, Data, and Design.

## ✨ Features

- 🚀 **Lightweight & Fast** — Built with Tauri, native performance, ~15MB installer
- 🌙 **Dark Theme** — Default dark UI, easy on the eyes
- 🔍 **Global Search** — Find tools by name or tags instantly
- 📂 **Category Navigation** — 6 categories, 34+ tools, collapsible sidebar
- 🌐 **Offline First** — Works without internet connection
- 📦 **One-Click Build** — DMG / App bundles for macOS

## 📦 Tools Overview

### 💻 Development Tools
| Tool | Description |
|------|-------------|
| JSON Formatter | Format, minify, validate |
| YAML / XML Formatter | Format & convert |
| Base64 / URL Encoder | Common encoding/decoding |
| Hash Generator | SHA-256 / MD5 |
| Regex Tester | Pattern matching test |
| Timestamp Converter | Seconds/ms ↔ Date |
| Text Diff | Line-by-line comparison |
| Git Commit Generator | Conventional Commits spec |
| CSS Box Model | Visual box model debugger |
| JWT Parser | Header / Payload decoder |
| Mock Data Generator | Template-based batch generation |
| Tailwind Generator | Click-to-build utility classes |
| API Debugger | Postman-style API testing |

### 📝 Content Tools
| Tool | Description |
|------|-------------|
| MD Export | Markdown render + themes + PNG export |
| Word Counter | CJK characters / words / reading time |
| Social Post Optimizer | Weibo / X / LinkedIn / Xiaohongshu / WeChat |
| Image Compressor | Batch JPEG compression |
| Watermark Tool | Text watermark + position/opacity |
| Batch Renamer | Prefix / suffix / find-replace / variables |

### 🏭 Industrial Tools
| Tool | Description |
|------|-------------|
| CSV Viewer | Table render + export |
| Hex Editor | Hex ↔ text conversion |
| Protocol Debugger | TCP / UDP simulation |
| Log Parser | Level filter + keyword search |
| Unit Converter | Temperature / pressure / flow / length |
| PLC Simulator | DB block read/write + sensor simulation |

### ⚡ Productivity
| Tool | Description |
|------|-------------|
| Pomodoro Timer | 25/5 min + progress ring |
| Password Generator | Custom length / character types |
| Lorem Generator | Chinese / English placeholder text |
| QR Code Generator | Custom colors / size |
| System Info | Platform / resolution / timezone |
| Todo List | Priority + completion status |

### 📈 Data Tools
| Tool | Description |
|------|-------------|
| Data Cleaner | Dedup / sort / remove empty lines |
| Stat Calculator | Mean / median / std dev / quartiles |
| Regex Replacer | Batch find & replace |
| 3D Model Viewer | GLTF / OBJ preview |

### 🎨 Design Tools
| Tool | Description |
|------|-------------|
| Color Converter | HEX / RGB / HSL |
| Gradient Generator | Linear / radial + CSS export |
| Shadow Generator | Box Shadow visual editor |
| SVG Viewer | Live code editor + preview |

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Rust (Tauri 2)
- **Styling**: Custom CSS (dark theme)
- **Build**: Tauri CLI + Cargo

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- Rust (install via [rustup](https://rustup.rs/))

### Install Dependencies
```bash
npm install
```

### Development Mode
```bash
npm run tauri dev
```

### Build for Production
```bash
npm run tauri build
```

Build artifacts:
- **macOS**: `src-tauri/target/release/bundle/macos/Toolbox.app`
- **DMG**: `src-tauri/target/release/bundle/dmg/`

## 📁 Project Structure

```
toolbox/
├── src/
│   ├── main.tsx              # Entry point
│   ├── App.tsx               # Main layout + navigation
│   ├── index.css             # Global styles
│   ├── categories.ts         # Category + tool registry
│   ├── lib/                  # Utilities
│   └── tools/
│       ├── dev/              # Development tools
│       ├── content/          # Content tools
│       ├── industrial/       # Industrial tools
│       ├── productivity/     # Productivity tools
│       ├── data/             # Data tools
│       └── design/           # Design tools
├── src-tauri/
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   └── src/main.rs
└── package.json
```

## 📄 License

MIT

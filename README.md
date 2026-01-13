# 極電資訊 Apple MDM 知識庫 (Enterprise Knowledge Base)

**Last Updated:** 2026-01-12

本專案為專為台灣教育場域建置的 Apple 行動裝置管理 (MDM) 知識庫系統。整合實務經驗與官方技術文件，提供結構化的技術指引與故障排除方案。系統採用現代化前端架構開發，強調高可用性、資訊安全與閱讀體驗。

## 系統概述

本平台基於 VitePress 靜態站點生成技術構建，結合 Cloudflare Edge 網路進行全球分發與身份驗證。系統設計遵循企業級資安規範，並針對技術文件閱讀進行了深度優化。

### 核心特性

- **身份驗證與存取控制**
  - 整合 Cloudflare Workers 與 Supabase Auth 實作無伺服器身份驗證。
  - 支援 Email Magic Link 登入機制，僅限特定教育網域存取。
  - 具備獨立的身分驗證介面 (Login Portal)，採用 Glassmorphism 設計規範。

- **資訊安全機制**
  - **原始碼防護**：構建過程強制關閉 Source Map 並啟用 Terser 混淆，防止逆向工程。
  - **內容保護**：全站實作 CSS 層級的防選取與防複製機制 (User-Select Protection)，代碼區塊 (Code Blocks) 除外以保留操作便利性。
  - **爬蟲阻擋**：配置嚴格的 `robots.txt` 宣告，禁止搜尋引擎索引 (Noindex Policy)。

- **使用者介面設計**
  - **字體系統**：整合 Google Fonts (`Inter` / `Noto Sans TC` / `JetBrains Mono`)，確保跨平台渲染一致性。
  - **響應式佈局**：客製化側邊欄 (Sidebar) 與導航系統，支援 Desktop 與 Mobile 裝置自適應顯示。
  - **閱讀體驗**：針對 Markdown 內容優化的排版樣式 (`markdown-styles.css`)，定義標準化的行高、間距與表格樣式。

## 技術架構

| 組件 | 規格 | 說明 |
| :--- | :--- | :--- |
| **Framework** | VitePress 1.6.4+ | 基於 Vite 5 的靜態站點生成器 (SSG)。 |
| **Language** | TypeScript 5.3+ | 採用嚴格模式 (Strict Mode) 與 Composition API。 |
| **Styling** | CSS Variables | 原生 CSS 變數架構，支援深色模式 (Dark Mode)。 |
| **Build Tool** | Volar (Hybrid Mode) | 開發環境採用 Vue Language Server 混合模式。 |
| **Security** | Terser / CSP | 構建時代碼壓縮與混淆。 |

## 專案結構

- `docs/`：系統核心目錄。
  - `.vitepress/`：系統配置、主題樣式與 Vue 組件。
  - `data/`：TypeScript 結構化資料模組 (Q&A, Glossary)。
  - `public/`：靜態資產 (Robots.txt, Login Portal)。
- `worker/`：Cloudflare Worker 邊緣運算邏輯。

## 開發指南

本專案採用 **Volar** 作為主要開發工具鏈。建議使用 VS Code 配合以下設配置進行開發：

### 環境需求

- Node.js 20+
- npm 10+

### 操作指令

```bash
# 安裝依賴 (含開發工具鏈)
npm install

# 啟動本地開發環境 (Hot Module Replacement)
npm run dev

# 建置生產版本 (執行 Terser 混淆與靜態生成)
npm run build
```

## 版權資訊

Copyright © 2026 **SuperInfo Co., Ltd.**
本系統內容受版權保護。未經授權禁止複製、轉載或用於機器學習模型訓練。

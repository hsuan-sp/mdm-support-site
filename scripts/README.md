# Scripts 目錄說明

這個目錄包含了維護 MDM Support Site 文檔品質所需的自動化工具。

## 🛠️ 主要工具

### [`fix-markdown.js`](./fix-markdown.js) (推薦使用)
這是**全功能整合腳本**，一次執行即可完成所有修正工作。

**功能包含：**
*   **格式規範化**：統一標題為二級標題 (`##`)，確保正確的空行與結尾換行。
*   **排版優化**：
    *   自動在中英文、數字之間添加空格 (例如：`iPad10` -> `iPad 10`)。
    *   統一專有名詞大小寫 (例如：`ipad` -> `iPad`, `wifi` -> `Wi-Fi`)。
*   **Lint 修正**：自動修復 `markdownlint` 常見錯誤 (MD022, MD030, MD031, MD032, MD047)。

**使用方式：**
```bash
# 在專案根目錄執行
node scripts/fix-markdown.js
```

---

## 🔍 其他工具

### [`verify-markdown-headers.js`](./verify-markdown-headers.js)
僅用於**驗證**文件格式是否符合規範，不會修改任何文件。適合在 CI/CD 流程中使用，或在提交代碼前檢查。

**檢查項目：**
*   是否存在非法的一級標題 (`#`) 或三級以上標題。
*   標題前後是否有正確的空行。
*   檔案結尾是否只有一個換行符。

**使用方式：**
```bash
node scripts/verify-markdown-headers.js
```

---

## ⚙️ 排版規則細節

我們的腳本遵循以下排版慣例：

1.  **標題層級**：除了 Frontmatter 外，正文一律使用二級標題 (`##`) 作為主要區塊。
2.  **空格**：中文與英文/數字之間必須有一個半形空格。
3.  **專有名詞**：
    *   `Apple` (不使用 apple)
    *   `iPad`, `iPhone`, `macOS` (注意大小寫)
    *   `Wi-Fi` (不使用 Wifi 或 wifi)
    *   `USB-C` (不使用 Type-C)
4.  **列表**：無序列表使用 `-` 或 `*`，縮排統一為 2 個空格。

## 📦 專案結構引用

這些腳本主要針對以下目錄進行處理：
*   `docs/data/items/qa` (中文問答)
*   `docs/data/items/glossary` (中文術語)
*   `docs/data/items-en/qa` (英文問答)
*   `docs/data/items-en/glossary` (英文術語)

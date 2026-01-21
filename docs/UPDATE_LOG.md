---
title: 版本更新日誌 (Changelog)
editLink: false
search: false
---

<script setup>
import { ref } from 'vue'

const activeLang = ref('zh') // 'zh' | 'en'
</script>

<div class="changelog-header">
  <h1>版本更新日誌 (Changelog)</h1>
  <div class="lang-switch">
    <button :class="{ active: activeLang === 'zh' }" @click="activeLang = 'zh'">繁體中文</button>
    <button :class="{ active: activeLang === 'en' }" @click="activeLang = 'en'">English</button>
  </div>
</div>

<div class="changelog-container">

<!-- v1.0.0 -->
<div class="version-block">
  <div class="version-meta">
    <div class="version-tag">v1.0.0</div>
    <div class="version-date">2026-01-21</div>
  </div>
  
  <div v-if="activeLang === 'zh'" class="version-content">
    <h3>🚀 初始正式發布 (Initial Release)</h3>
    <p>本專案首個正式版本，完整建構了針對台灣教育場域的 Apple MDM 雙語知識庫系統。</p>
    
    <h4>🔥 核心功能與內容</h4>
    <ul>
      <li><strong>全站內容建置</strong>：完成 137 個術語 (Glossary) 與 8 大類別 Q&A 的中英文內容撰寫，總計超過 200 篇文章。</li>
      <li><strong>2026 技術驗證</strong>：所有內容皆通過 iOS 26 與 macOS Tahoe 技術規格驗證，確保資訊時效性。</li>
      <li><strong>雙語即時切換</strong>：實作 <code>GlossaryApp</code> 與 <code>IntegratedGuideApp</code> 核心組件，支援無縫中英切換。</li>
      <li><strong>錯誤回報機制</strong>：全站右下角新增懸浮回報按鈕 (ReportIssue)，支援全平台原生郵件軟體呼叫。</li>
    </ul>

    <h4>🛠️ 架構與系統</h4>
    <ul>
      <li><strong>自動化維護</strong>：建立 Python 內容管理工具 (<code>content_manager.py</code>) 與自動索引生成腳本。</li>
      <li><strong>文件規範</strong>：制定完整的 <code>INSTRUCTION</code> 撰寫指南，規範術語使用與版本標註。</li>
      <li><strong>資訊安全</strong>：實作原始碼混淆 (Obfuscation) 與防複製 (User-select protection) 機制。</li>
    </ul>
  </div>

  <div v-if="activeLang === 'en'" class="version-content">
    <h3>🚀 Initial Release</h3>
    <p>The first official release of the project, establishing a complete bilingual Apple MDM knowledge base tailored for Taiwan's education sector.</p>

    <h4>🔥 Core Features & Content</h4>
    <ul>
      <li><strong>Full Content Deployment</strong>: Completed all 137 Glossary terms and 8 categories of Q&A in both Traditional Chinese and English, totaling over 200 articles.</li>
      <li><strong>2026 Technical Verification</strong>: All content verified against iOS 26 and macOS Tahoe specifications to ensure currency.</li>
      <li><strong>Bilingual Switching</strong>: Implemented core components <code>GlossaryApp</code> and <code>IntegratedGuideApp</code> for seamless language toggling.</li>
      <li><strong>Issue Reporting</strong>: Added a floating Report Issue button on all pages, supporting native mail clients across all platforms.</li>
    </ul>

    <h4>🛠️ Architecture & System</h4>
    <ul>
      <li><strong>Automated Maintenance</strong>: Established Python content management tools (<code>content_manager.py</code>) and automated index generation scripts.</li>
      <li><strong>Documentation Standards</strong>: Define comprehensive <code>INSTRUCTION</code> guidelines for terminology usage and version tagging.</li>
      <li><strong>Security</strong>: Implemented source code obfuscation and user-select protection mechanisms.</li>
    </ul>
  </div>
</div>

</div>

<hr class="divider" />

<div v-if="activeLang === 'zh'" class="guidelines">
  <h2>📝 更新日誌撰寫規範</h2>
  <p>為維護日誌的專業性與易讀性，所有維護者必須遵守以下規範：</p>
  
  <h3>1. 記錄原則</h3>
  <ul>
    <li><strong>⭕ 必須記錄</strong>：新增題目/術語、刪除內容、功能重大更新、架構調整。</li>
    <li><strong>❌ 無需記錄</strong>：錯字修正、格式微調、Bug 修復 (除非影響重大)、翻譯潤飾。</li>
  </ul>

  <h3>2. 版本號規則 (Semantic Versioning)</h3>
  <ul>
    <li><strong>Major (x.0.0)</strong>：網站架構重構或重大政策變更。</li>
    <li><strong>Minor (1.x.0)</strong>：新增一批新的 Q&A 題目或新功能模組。</li>
    <li><strong>Patch (1.0.x)</strong>：單一題目修正或緊急錯誤修復。</li>
  </ul>

  <h3>3. 格式要求</h3>
  <ul>
    <li>使用 HTML 結構而非 Markdown，以確保樣式統一。</li>
    <li><strong>標題</strong>：使用 Emoji + 簡短描述 (如 <code>🚀 新功能</code>, <code>📝 內容更新</code>)。</li>
    <li><strong>雙語對照</strong>：必須同時提供繁體中文與英文說明。</li>
  </ul>
</div>

<div v-if="activeLang === 'en'" class="guidelines">
  <h2>📝 Changelog Guidelines</h2>
  <p>To maintain professionalism and readability, all maintainers must adhere to the following guidelines:</p>

  <h3>1. Logging Principles</h3>
  <ul>
    <li><strong>⭕ Must Log</strong>: Adding new topics/terms, deleting content, major feature updates, architectural changes.</li>
    <li><strong>❌ No Log Needed</strong>: Typo fixes, minor formatting, bug fixes (unless critical), translation polish.</li>
  </ul>

  <h3>2. Versioning Rules (Semantic Versioning)</h3>
  <ul>
    <li><strong>Major (x.0.0)</strong>: Site re-architecture or major policy changes.</li>
    <li><strong>Minor (1.x.0)</strong>: Batch addition of new Q&A topics or new feature modules.</li>
    <li><strong>Patch (1.0.x)</strong>: Single topic correction or critical hotfix.</li>
  </ul>

  <h3>3. Formatting Requirements</h3>
  <ul>
    <li>Use HTML structure instead of Markdown to ensure consistent styling.</li>
    <li><strong>Headers</strong>: Use Emoji + Short Description (e.g., <code>🚀 New Features</code>, <code>📝 Content Update</code>).</li>
    <li><strong>Bilingual</strong>: Must provide both Traditional Chinese and English descriptions simultaneously.</li>
  </ul>
</div>

<style scoped>
.changelog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  border-bottom: 1px solid var(--vp-c-divider);
  padding-bottom: 20px;
}

.lang-switch {
  display: flex;
  background: var(--vp-c-bg-soft);
  padding: 4px;
  border-radius: 8px;
}

.lang-switch button {
  padding: 6px 16px;
  font-size: 14px;
  border-radius: 6px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  transition: all 0.2s;
}

.lang-switch button.active {
  background: var(--vp-c-bg);
  color: var(--vp-c-brand);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.version-block {
  display: flex;
  gap: 32px;
  margin-bottom: 60px;
  position: relative;
}

.version-block::before {
  content: '';
  position: absolute;
  left: 38px;
  top: 40px;
  bottom: -70px;
  width: 2px;
  background: var(--vp-c-divider);
  opacity: 0.5;
}

.version-block:last-child::before {
  display: none;
}

.version-meta {
  flex-shrink: 0;
  width: 120px;
  text-align: right;
  padding-top: 4px;
}

.version-tag {
  font-family: var(--vp-font-family-mono);
  font-size: 16px;
  font-weight: 800;
  color: var(--vp-c-brand);
  background: var(--vp-c-bg-soft);
  padding: 4px 10px;
  border-radius: 6px;
  display: inline-block;
  margin-bottom: 6px;
}

.version-date {
  font-size: 13px;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
}

.version-content {
  flex-grow: 1;
  padding-bottom: 20px;
}

.version-content h3 {
  margin: 0 0 16px 0;
  font-size: 20px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.version-content h4 {
  margin: 24px 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  display: flex;
  align-items: center;
  gap: 8px;
}

.version-content ul {
  padding-left: 20px;
  margin: 0;
}

.version-content li {
  margin-bottom: 8px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

.divider {
  margin: 60px 0;
  border: none;
  border-top: 1px dashed var(--vp-c-divider);
}

.guidelines {
  background: var(--vp-c-bg-soft);
  padding: 30px;
  border-radius: 12px;
}

@media (max-width: 768px) {
  .version-block {
    flex-direction: column;
    gap: 16px;
  }
  
  .version-block::before {
    left: 14px;
    top: 36px;
    bottom: -30px;
  }
  
  .version-meta {
    width: 100%;
    text-align: left;
    display: flex;
    align-items: center;
    gap: 12px;
  }
}
</style>

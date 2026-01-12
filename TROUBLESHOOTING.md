# Vue 組件錯誤排查清單

## 目前已修復的問題
✅ AppSidebar 移到正確目錄
✅ tsconfig.json 包含 .vitepress/**/*.vue
✅ AppSidebar 使用 defineComponent 語法 (Vetur 相容)
✅ 添加 :deep() 樣式給 slot 內容
✅ 移除重複註釋

## 如果您仍看到錯誤，可能的原因：

### 1. Vetur vs Volar 問題
**症狀:** "has no default export" 錯誤
**解決方案:** 
- 按 Cmd+Shift+X 打開擴充套件
- 搜尋 "Vetur" 並停用
- 搜尋 "Vue Language Features (Volar)" 並安裝
- 按 Cmd+Shift+P → "Reload Window"

### 2. TypeScript 語言服務需要重啟
**症狀:** 紅色波浪線、類型錯誤
**解決方案:**
- 按 Cmd+Shift+P
- 輸入 "TypeScript: Restart TS Server"
- 或直接 "Reload Window"

### 3. node_modules 需要重新安裝
**症狀:** "Cannot find module" 錯誤
**解決方案:** (需要終端機)
```bash
cd /Users/superinfo/Documents/GitHub/mdm-support-site
rm -rf node_modules package-lock.json
npm install
```

### 4. Vue 檔案沒有被 TypeScript 識別
**症狀:** Import 語句顯示紅線
**已修復:** tsconfig.json 已更新包含 .vitepress/**/*.vue

### 5. CSS 變數或選擇器錯誤
**症狀:** "Unknown property" 警告
**說明:** 這些通常只是警告，不影響 build

## 目前專案狀態
- ✅ Vue 3.5.25 (透過 VitePress)
- ✅ TypeScript 支援
- ✅ 所有組件使用正確的語法
- ✅ Composables 正確導出
- ✅ 樣式完整

## 如果錯誤持續存在
請告訴我具體看到什麼錯誤訊息，例如：
- 檔案名稱
- 行號
- 錯誤文字
這樣我可以精確修復。

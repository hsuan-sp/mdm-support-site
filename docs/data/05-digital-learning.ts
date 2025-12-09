import { QASection } from '../types'

export const data: QASection[] = [
  {
    title: '第五部分：數位學習精進方案 (生生用平板) 專區',
    items: [
      {
        id: 'dl-1',
        question: '[重要] 配合教育部 CDN 政策調整，iPadOS 17 以上裝置不再顯示 VPN 圖示是否正常？',
        important: true,
        tags: ['精進方案', 'VPN', 'iPadOS 17', 'CDN'],
        answer: `
**答案：是的，這是正常現象。**

**詳細說明**：
*   **iPadOS 17+**：Jamf Trust 改用 **「內容過濾器」** 與 **「DNS 代理」** 架構，不再建立全局 VPN，因此**不會顯示 VPN 圖示**。
*   **iPadOS 16-**：維持舊架構，**會顯示 VPN 圖示**。

**如何自我檢查**：
打開 **Jamf Trust App**，只要顯示 **綠色「受保護」**，且沒有錯誤訊息，即代表數據回報功能正常運作。
        `
      },
      {
        id: 'dl-2',
        question: '[重要] 發現部分裝置在教育部載具管理平台顯示「未使用」或數據未上傳，如何自我檢測？',
        important: true,
        tags: ['數據回報', '未使用', '故障排除'],
        answer: `
**排查流程**：
1.  **Jamf Trust App 狀態**：
    *   必須顯示 **綠色勾勾**。
    *   若顯示紅色錯誤或「缺少設定描述檔」，請參考 Q4 修復。
2.  **系統設定檢查 (iPadOS 17+)**：
    *   設定 > 一般 > VPN 與裝置管理 > Jamf Trust。
    *   確認 **內容過濾器** 狀態為 **「執行中 (Running)」**。
3.  **連線問題**：
    *   Jamf Pro 後台「上次更新時間」是否超過 7 天？若是，請先解決連線問題 (Q3)。
4.  **序號問題**：
    *   是否剛換過整新機？請確認即時向推動辦公室回報新舊序號異動。
        `
      },
      {
        id: 'dl-3',
        question: '[操作步驟] 裝置無法順利同步 Jamf Pro 或 Jamf Trust 連線異常，如何執行「重置網路設定」？',
        important: false,
        tags: ['重置網路', '連線異常'],
        answer: `
此功能可清除網路快取而不刪除資料。
**注意**：執行後裝置名稱會變回 "iPad"，需記得改回。

**步驟**：
1.  設定 > 一般 > 移轉或重置 iPad > 重置 > **「重置網路設定」**。
2.  裝置重開機，重新連接 Wi-Fi。
3.  打開 Jamf Trust 觸發同步。
4.  在 Jamf Pro 或使用 MUT 將裝置改回正確名稱。
        `
      },
      {
        id: 'dl-4',
        question: 'Jamf Trust App 顯示「缺少設定描述檔」或一直轉圈圈無法連線，該如何修復？',
        important: false,
        tags: ['Jamf Trust', '描述檔', '重裝'],
        answer: `
**解決方案 (重裝 Trust)**：
1.  Jamf Pro > **行動裝置 App** > **Jamf Trust**。
2.  **範圍 (Scope)** > **排除 (Exclusions)**。
3.  將該裝置加入排除列表，儲存。等待 App 從 iPad 上消失 (移除)。
4.  再將該裝置從排除列表中刪除 (加回範圍)。
5.  Jamf 會重新派送最新版 Trust App 與描述檔，通常即可修復。
        `
      },
      {
        id: 'dl-5',
        question: '學校更換了故障的平板（換機），如何讓新序號同步到教育部的管理系統？',
        important: false,
        tags: ['換機', '序號', 'MDM平台'],
        answer: `
**流程**：
1.  確認新機已納管至 Jamf Pro。
2.  學校聯繫 **數位學習推動辦公室** 或 **教育部 MDM 客服**。
3.  提供 **「舊機序號」** 與 **「新機序號」** 對照表。
4.  由推辦或廠商協助在教育部後台更新資料。
*注意：Jamf Pro 的資料不會自動同步去修改教育部平台的序號紀錄，必須人工申請。*
        `
      },
      {
        id: 'dl-6',
        question: '如何確認學校的 Jamf Pro 是否有正確安裝並啟用「教育部預設 App 資料夾」？',
        important: false,
        tags: ['資料夾', '混合版', '佈局'],
        answer: `
**檢查**：
1.  Jamf Pro > **設定描述檔**。
2.  尋找 **\`教育部預設 App 資料夾 - 混合版\`**。
3.  檢查 Scope 是否包含學校的學生群組。
4.  若平板未生效，可嘗試「排除再加回」以強制重送。
        `
      },
      {
        id: 'dl-7',
        question: '學生自行刪除了 Jamf Trust App，會影響使用率計算嗎？如何防止刪除？',
        important: false,
        tags: ['刪除App', '使用率', '限制'],
        answer: `
**影響**：**會**。Jamf Trust 被刪除後，數據回報即刻停止。

**防止**：
*   **限制描述檔**：勾選 **「禁止移除 App」**。
*   若發現被刪除，請立即重送 Jamf Trust 安裝指令，並檢查限制描述檔是否未正確套用。
        `
      },
      {
        id: 'dl-8',
        question: '在 Jamf Pro 中，如何區分「精進計畫平板」與「校內自購平板」的管理群組？',
        important: false,
        tags: ['群組管理', '智慧型群組', '命名規則'],
        answer: `
**最佳實踐：命名規則 + 智慧型群組**
1.  **命名**：精進平板統一前綴 (如 \`111-\`)，自購平板用另一前綴 (如 \`OWN-\`)。
2.  **智慧型群組**：
    *   建立群組 "精進計畫"。
    *   條件 (Criteria)：\`Device Name\` \`like\` \`111-\`。
    *   Jamf 會自動將符合命名規則的裝置歸類，便於分開派送教育部專屬政策。
        `
      },
      {
        id: 'dl-9',
        question: '收到教育局公文要求提供「載具清單」或「MDM 連線情形」，該從哪裡匯出資料？',
        important: false,
        tags: ['匯出', '報表', 'CSV'],
        answer: `
**匯出步驟**：
1.  Jamf Pro > **裝置** > **搜尋** (或進入特定智慧型群組 > 檢視)。
2.  點擊右下角 **「匯出 (Export)」**。
3.  選擇 \`CSV\` 格式。
4.  建議包含欄位：\`Device Name\`, \`Serial Number\`, \`Wi-Fi MAC Address\`, \`Last Inventory Update\`。
        `
      },
      {
        id: 'dl-10',
        question: '教育部精進平板的「遠端清除」權限與一般平板有何不同？',
        important: true,
        tags: ['遠端清除', '權限', '精進方案'],
        answer: `
**答案：完全相同。**
只要是納管裝置，清除指令皆有效且**無法復原**。請務必小心操作，避免誤刪整個群組。
        `
      },
      {
        id: 'dl-11',
        question: '如何在不影響使用率回報的前提下，暫時解除特定網站（如 YouTube, Netflix）的封鎖？',
        important: false,
        tags: ['解封鎖', '排除', 'Jamf Trust'],
        answer: `
**暫時解法**：
1.  找到負責過濾的描述檔 (如 \`Jamf Trust Profile\`)。
2.  在 **Scope** > **Exclusions** 加入該裝置。
3.  **教學結束後務必加回**：排除期間**不會**計算使用數據，請務必記得恢復，以免影響教育部 KPI。
        `
      },
      {
        id: 'dl-12',
        question: '什麼是「低數據模式」？它如何影響 Jamf Trust 的運作與 App 更新？',
        important: false,
        tags: ['低數據模式', '更新失敗', '排錯'],
        answer: `
**影響**：
*   **Jamf Trust**：可能導致回報延遲。
*   **更新**：**會暫停** App 安裝與 iOS 系統更新。

**檢查**：
若發現裝置久未更新或指令卡住，請檢查 Wi-Fi 設定中是否開啟了 **「低數據模式」**，請將其**關閉**。
        `
      }
    ]
  }
]

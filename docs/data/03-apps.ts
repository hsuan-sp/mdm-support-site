import { QASection } from '../types'

export const data: QASection[] = [
  {
    title: '第三部分：應用程式派送與管理 (Apps & Books)',
    items: [
      {
        id: 'app-1',
        question: '[常用] 已經在 Jamf 指派了 App，但在 iPad 上一直顯示「等待中」或無法安裝，如何排除？',
        important: true,
        tags: ['App安裝', '等待中', '故障排除', '指令卡住'],
        answer: `
**故障排除流程**：
1.  **檢查裝置端狀態**：
    *   **網路連線**：開啟 Safari 確認能否上網。
    *   **儲存空間**：設定 > 一般 > iPad 儲存空間，確認空間足夠。
    *   **重開機**：強制重啟 iPad 可解決多數暫存錯誤。
2.  **Jamf Pro 重送指令**：
    *   搜尋裝置 > **「管理」** > **「管理命令」**。
    *   點選 **「取消所有失敗和待處理的命令」**。
    *   點選 **「更新資產 (Update Inventory)」** 強制同步。
3.  **檢查 App 設定**：
    *   確認 **「範圍 (Scope)」** 包含該裝置。
    *   確認 **「管理式發佈」** 中已勾選 **「指派大量採購的內容 (Assign VPP Content)」**。
4.  **檢查相容性**：
    *   App 是否要求較新的 iPadOS 版本？(如需 iOS 17 但裝置是 iOS 15)。
        `
      },
      {
        id: 'app-2',
        question: '[常用] 派送 App 時出現「License info not found」或授權不足的錯誤，如何解決？',
        important: true,
        tags: ['授權不足', 'VPP', 'License'],
        answer: `
**原因**：ASM 中的 App 授權數量不足，或指派到了錯誤的「位置 (Location)」。

**解決方案**：
1.  **ASM 端補購**：
    *   登入 [ASM](https://school.apple.com/) > **App**。
    *   搜尋該 App，確認 **「可用」** 數量。即使是免費 App 也要「購買」足夠數量。
    *   **重要**：確認購買時選擇的 **「位置」** 是與 Jamf Pro 連動的那個。
2.  **Jamf Pro 端同步**：
    *   前往 **設定** > **全域管理** > **大量採購**。
    *   點選對應帳號，按 **「同步內容」** 或等待自動同步。
        `
      },
      {
        id: 'app-3',
        question: '如何在 Apple School Manager (ASM) 購買免費 App 並同步到 Jamf？',
        important: false,
        tags: ['購買App', 'ASM', '免費'],
        answer: `
**操作步驟**：
1.  由內容經理/管理員登入 [ASM](https://school.apple.com)。
2.  點選左側 **「App」**，搜尋需要的 App 名稱。
3.  點選 App，在右側 **「指定給」** 選擇正確的位置 (如 \`Jamf Pro_VPP\`)。
4.  **數量**：輸入需要的數量 (建議一次買足，如 500 個)。
5.  點擊 **「取得 (Get)」**。
6.  數分鐘後，App 即會自動同步至 Jamf Pro 的「行動裝置 App」清單中。
        `
      },
      {
        id: 'app-4',
        question: '如何設定 App 為「自動安裝」而非在 Self Service 中手動下載？',
        important: false,
        tags: ['自動安裝', 'Self Service', '派送方式'],
        answer: `
**設定步驟**：
1.  在 Jamf Pro 點選該 App > **「一般」**。
2.  在 **Distribution Method** (派送方式) 選擇：
    *   **Install Automatically/Prompt User to Install** (自動安裝)。
    *   *若選 Make Available in Self Service 則需手動下載。*
3.  建議同時勾選：
    *   **「將非管理式 App 轉換為管理式」**。
    *   **「排程 Jamf Pro 檢查 App Store 更新」**。
    *   **「自動強制執行 App 更新」**。
        `
      },
      {
        id: 'app-5',
        question: '為什麼教師機或特定裝置無法刪除 App（長按 App 沒有「移除」選項）？',
        important: false,
        tags: ['刪除App', '限制'],
        answer: `
**原因**：MDM 限制描述檔中啟用了「禁止移除 App」。

**解決方案**：
*   **暫時解除**：在 Jamf Pro 將該裝置從限制描述檔的 Scope 中「排除」。
*   **裝置端刪除 (繞過限制)**：
    *   前往 **「設定」>「一般」>「iPad 儲存空間」**。
    *   點選 App > **「刪除 App」**。此方法通常不受主畫面移除限制的影響。
        `
      },
      {
        id: 'app-6',
        question: '如何禁止學生自行從 App Store 下載遊戲或與教學無關的應用程式？',
        important: false,
        tags: ['App Store', '禁止下載', '限制'],
        answer: `
**解決方案**：
1.  編輯「學生限制描述檔」。
2.  前往 **「限制 (Restrictions)」** > **「App」** 頁籤。
3.  取消勾選 (或設為限制) **「允許使用 App Store」** 或 **「允許安裝 App」**。
4.  **效果**：App Store 圖示會從主畫面消失，學生無法自行安裝任何 App。
        `
      },
      {
        id: 'app-7',
        question: '如何派送「網頁捷徑 (Web Clip)」到 iPad 主畫面，並設定自訂圖示？',
        important: false,
        tags: ['Web Clip', '捷徑', '圖示'],
        answer: `
**步驟**：
1.  Jamf Pro > **設定描述檔** > **+ 新增**。
2.  選擇 **「Web Clip」** Payload。
3.  **標籤**：顯示名稱 (如「校務系統」)。
4.  **URL**：完整網址。
5.  **圖示**：上傳 180x180 的 PNG/JPG 圖檔。
6.  **卸除式**：若不希望學生刪除，請取消勾選。
7.  指派給裝置後，主畫面即會出現該捷徑。
        `
      },
      {
        id: 'app-8',
        question: '已購買的付費 App，如何從舊的 MDM 伺服器轉移授權給新的 Jamf 使用？',
        important: false,
        tags: ['授權轉移', 'VPP', '付費App'],
        answer: `
**ASM 端操作**：
1.  登入 ASM > **App 與書籍**。
2.  搜尋該付費 App，點開詳情。
3.  找到舊 MDM 所在的「位置」，點擊 **「轉讓 (Transfer)」**。
4.  輸入數量，目標位置選擇與 Jamf Pro 連動的新位置。
5.  完成後回到 Jamf Pro 同步 VPP。
        `
      },
      {
        id: 'app-9',
        question: '如何更新 iPad 上的 App 版本？可以設定自動更新嗎？',
        important: false,
        tags: ['App更新', '自動更新'],
        answer: `
**方法 A：強制立即更新**
*   在 Jamf Pro App 頁面點擊右下角 **「強制更新 (Force Update)」** 紐。

**方法 B：排程自動更新 (推薦)**
*   在 App 的 **「一般」** 設定中，勾選：
    1.  **「自動強制更新」**。
    2.  **「排程 Jamf Pro 檢查 App Store 更新」**。
*   Jamf 會定期檢查 App Store 並自動推送更新指令。
        `
      },
      {
        id: 'app-10',
        question: '派送 Google 系列 App (Meet, Classroom) 時，出現版本不相容或需要 iOS 更新的提示，該怎麼辦？',
        important: false,
        tags: ['版本不相容', '舊版相容', 'Google Meet'],
        answer: `
**原因**：Google 等開發商通常只支援最新的 2-3 個 OS 版本。舊 iPad (如 iOS 15) 無法安裝最新版 App。

**解決方案**：
1.  **優先：更新 iPadOS (若硬體支援)**：
    *   發送 **「更新 OS 版本」** 指令，升級系統以相容 App。
2.  **次選：下載舊版相容 App (若硬體已達上限)**：
    *   確保 App 透過 **「管理式發佈 (VPP)」** 指派權限。
    *   將 App 設定為 **「自動安裝」**。
    *   Apple 伺服器會嘗試提供 **「最後相容的舊版本」** 給該裝置。
    *   *若失敗，嘗試將裝置從 Scope 移除後再加回，重新觸發一次。*
        `
      },
      {
        id: 'app-11',
        question: '如何隱藏 iPad 內建的 App（如：FaceTime, 訊息, App Store）？',
        important: false,
        tags: ['隱藏App', '限制', 'Bundle ID'],
        answer: `
**解決方案**：
透過 **限制描述檔** > **App** > **「不允許部分 App (Disallow some apps)」**。

**常用 Bundle ID**：
*   **App Store**: \`com.apple.AppStore\`
*   **FaceTime**: \`com.apple.facetime\`
*   **訊息 (Messages)**: \`com.apple.MobileSMS\`
*   **相機 (Camera)**: \`com.apple.camera\`

輸入對應 ID 並儲存，圖示即會消失。

---
**參考文件**：
*   [Apple 內建 App Bundle ID 列表 (Apple 支援)](https://support.apple.com/zh-tw/guide/deployment/depece748c41/web)
        `
      },
      {
        id: 'app-12',
        question: '什麼是「管理式發佈 (Managed Distribution)」？為什麼一定要勾選才能派送？',
        important: false,
        tags: ['管理式發佈', 'VPP', '免AppleID'],
        answer: `
**核心概念**：
「管理式發佈」是將 App 授權指派給 **「裝置序號」**，而非使用者 Apple ID。

**重要性**：
*   **必須勾選「指派大量採購的內容 (Assign VPP Content)」**。
*   **效果**：iPad **無需登入 Apple ID** 即可靜默安裝 App。
*   若不勾選：iPad 會跳出視窗要求輸入 Apple ID 密碼，導致大量部署失敗。
        `
      }
    ]
  }
]

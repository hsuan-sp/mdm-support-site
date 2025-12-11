import type { QASection } from '../.vitepress/types'

export const educationQA: QASection[] = [
  {
    title: "第八部分：教育場域實戰經驗 (Education Scenarios)",
    items: [
      {
        id: "edu-01",
        question: "iPadOS 17 以上的裝置，為什麼沒有看見 VPN 圖示？這樣過濾功能有在運作嗎？",
        answer: `
**這是正常現象。**

在 iPadOS 17 (含) 以上版本，配合教育部的新版架構，**Jamf Trust** 改採用 **「DNS 代理 (DNS Proxy)」** 與 **「內容過濾器 (Content Filter)」** 技術運作，不再需要建立傳統的 VPN 通道。

**如何確認運作正常：**
1.  **檢查圖示**：螢幕右上角**不會**出現 [VPN] 圖示。
2.  **檢查 App**：打開 **Jamf Trust** App，只要顯示**綠色盾牌 (保護中)**，即代表過濾與數據回報功能皆正常運作。
`,
        tags: ["iPadOS 17", "VPN", "Content Filter", "Jamf Trust"],
        important: true
      },
      {
        id: "edu-02",
        question: "「共用 iPad (Shared iPad)」與「訪客模式」有什麼區別？",
        answer: `
**共用 iPad (Shared iPad)**：
*   **登入方式**：學生使用專屬的 **「管理式 Apple ID」** 登入。
*   **資料保存**：系統會將資料（照片、作業）儲存在雲端 (iCloud)。學生換到別台 iPad 登入，資料會自動同步回來。
*   **適用情境**：一人一號的長期課程、需要延續進度的專題製作。

**訪客模式 (Guest Mode)**：
*   **登入方式**：免帳號，直接點擊「訪客」登入。
*   **資料保存**：**不保存**。登出後，所有資料、瀏覽紀錄與下載的檔案會被**立即清除**。
*   **適用情境**：圖書館查詢、單次體驗課程、不需存檔的隨堂測驗。
`,
        tags: ["Shared iPad", "Guest Mode", "Managed Apple ID"]
      },
      {
        id: "edu-03",
        question: "老師的 iPad 與學生的 iPad 權限有什麼不同？",
        answer: `
在 MDM 的管理架構下，通常會依據 **「角色」** 給予不同的設定描述檔：

**老師用 iPad (Teacher Device)**：
*   **限制較少**：通常允許使用 App Store 下載教學輔助工具。
*   **特殊功能**：預載 **「Apple 課堂 (Classroom)」** App，擁有管理學生裝置的權限（如鎖定畫面、導引 App）。
*   **隱私**：雖受學校監管，但 MDM **無法** 查看老師的瀏覽紀錄、照片或個人訊息。

**學生用 iPad (Student Device)**：
*   **限制嚴格**：App Store 通常被隱藏，僅能透過 Self Service 安裝核准的 App。
*   **功能限制**：可能被禁止修改桌布、禁止修改時間、強制開啟藍牙與 Wi-Fi (為了 Apple 課堂)。
*   **網路過濾**：在精進方案下，會強制過濾不當資訊並記錄使用時數。
`,
        tags: ["Roles", "Permissions", "Teacher vs Student"]
      },
      {
        id: "edu-04",
        question: "不同班級輪流使用同一批平板，課堂間隔該如何快速整理？",
        answer: `
建議建立 **「課堂重置流程」**：

1.  **若使用訪客模式**：
    *   下課前，請學生點擊頭像選擇 **「登出」**。
    *   系統會自動清除所有資料，下一班學生拿到的是乾淨的桌面。

2.  **若使用一般模式 (1對1模式但輪用)**：
    *   **相簿清理**：請學生養成習慣，下課前自行刪除剛剛拍攝的照片。
    *   **帳號登出**：若有登入 Google Classroom 或 Canva，務必在下課前登出。
    *   **MDM 重置 (進階)**：若需徹底還原，管理員可透過 Jamf Pro 發送 **「清除 (Wipe)」** 指令（需搭配 **Return to Service** 功能），讓平板在 5 分鐘內重置並自動連回 Wi-Fi 待命。
`,
        tags: ["Classroom Management", "Reset", "Workflow"]
      }
    ]
  }
];

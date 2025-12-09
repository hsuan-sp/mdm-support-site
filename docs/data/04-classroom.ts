import { QASection } from '../types'

export const data: QASection[] = [
  {
    title: '第四部分：課堂管理與限制設定 (Classroom Management)',
    items: [
      {
        id: 'cls-1',
        question: '[常用] 「Apple 課堂」App 顯示學生「離線」或無法連接，該如何排查（藍牙/Wi-Fi/網段）？',
        important: true,
        tags: ['Apple課堂', '離線', '故障排除', '藍牙'],
        answer: `
**排查流程**：
1.  **硬體檢查**：
    *   **Wi-Fi**：師生必須連上 **同一 SSID** 且在 **同一網段**。
    *   **藍牙**：師生裝置 **藍牙必開** (用於近端探索)。
    *   **距離**：建議在同一教室內 (10公尺左右)。
2.  **網路環境**：
    *   詢問網管是否開啟了 **「AP 隔離 (Client Isolation)」**？若開啟，裝置間無法通訊，Apple 課堂會全滅。
    *   防火牆是否阻擋了 Bonjour 服務埠 (UDP 5353)？
3.  **Jamf 設定**：
    *   確認「教育設定描述檔」已安裝。
    *   在 Jamf Pro 重新儲存一次班級設定，強制觸發更新。
4.  **裝置與使用者配對**：
    *   確認該學生的「使用者帳號」有正確配對到其手上的「iPad」。
        `
      },
      {
        id: 'cls-2',
        question: '如何在 Jamf Pro 中建立「班級」並對應教師機與學生機？',
        important: false,
        tags: ['建立班級', 'Roster'],
        answer: `
**步驟**：
1.  **配對**：確保使用者 (User) 與裝置 (Mobile Device) 已建立關聯。
2.  **建立班級**：
    *   Jamf Pro > **裝置** > **群組分類** > **班級 (Classes)** > **+ 新增**。
    *   命名班級 (如 701 國文)。
3.  **加入成員**：
    *   **教師**：搜尋並加入老師的使用者帳號。
    *   **學生**：搜尋並加入學生的使用者帳號 (或使用者群組)。
4.  **儲存**：Jamf 會自動發送教育設定檔。老師打開課堂 App 即可看到該班級。
        `
      },
      {
        id: 'cls-3',
        question: 'Jamf Teacher App 與 Apple 課堂 App 有什麼不同？學校該用哪一個？',
        important: false,
        tags: ['Jamf Teacher', 'Apple課堂', '比較'],
        answer: `
**Apple 課堂 (Classroom)**：
*   **優勢**：即時 **螢幕監看 (螢幕牆)**、導覽 App。
*   **限制**：需藍牙/同一 Wi-Fi，適合「教室現場」互動。

**Jamf Teacher**：
*   **優勢**：**無視網路限制** (遠端亦可)，可設定「課程模式 (Lesson)」強制鎖定特定 App 或禁用相機。
*   **限制**：**無法**看學生畫面。

**建議**：兩者並用。用 Jamf Teacher 進行嚴格控管 (如考試模式)，用 Apple 課堂進行巡視與畫面監看。
        `
      },
      {
        id: 'cls-4',
        question: '如何設定「限制描述檔 (Configuration Profile)」，禁止學生修改桌布或裝置名稱？',
        important: false,
        tags: ['限制', '桌布', '裝置名稱'],
        answer: `
**操作**：
1.  Jamf Pro > **設定描述檔** > 編輯「學生限制」。
2.  **限制 (Restrictions)** > **功能 (Functionality)**：
    *   取消勾選 **「允許修改背景圖片」**。
    *   取消勾選 **「允許修改裝置名稱」**。
3.  儲存並派送。選項將會反灰或消失。
        `
      },
      {
        id: 'cls-5',
        question: '如何設定 iPad 的「單一 App 模式 (Single App Mode)」，讓學生上課時只能用特定 App？',
        important: false,
        tags: ['單一App模式', '鎖定', 'Kiosk'],
        answer: `
**方法 A：Jamf Teacher (老師用)**
*   在 Jamf Teacher 建立「課程」，只允許一個 App，啟用後學生機即被鎖定。

**方法 B：Jamf Pro (管理員用)**
*   建立描述檔 > **「單一 App 模式」** Payload。
*   輸入 App 的 Bundle ID。
*   **注意**：此為永久鎖定，除非移除描述檔，否則無法退出，請謹慎使用。
        `
      },
      {
        id: 'cls-6',
        question: '如何透過 Jamf 限制學生在特定時段（如上課時間）只能瀏覽白名單網站？',
        important: false,
        tags: ['網頁白名單', '內容過濾', 'Web Filter'],
        answer: `
**設定**：
1.  建立描述檔 > **「內容過濾器 (Content Filter)」** Payload。
2.  類型選擇 **「特定網站 (Specific Websites Only)」**。
3.  輸入允許的 URL 列表。
4.  **時段控制**：Jamf Pro 本身無法依時間自動開關描述檔。需配合 Jamf Teacher 或由管理員手動切換指派 Scope。
        `
      },
      {
        id: 'cls-7',
        question: '如何關閉 iPad 的「專用 Wi-Fi 位址 (Private Wi-Fi Address)」以配合學校防火牆管理？',
        important: false,
        tags: ['MAC隨機化', '專用Wi-Fi位址', '防火牆'],
        answer: `
**原因**：iPadOS 14+ 預設使用隨機 MAC，導致防火牆白名單失效。

**解決方案**：
1.  編輯 **Wi-Fi 設定描述檔**。
2.  在 Payload 中勾選 **「停用關聯 MAC 位址隨機化 (Disable MAC Address Randomization)」**。
3.  套用後，iPad 連接該 Wi-Fi 將強制使用真實 MAC 位址。
        `
      },
      {
        id: 'cls-8',
        question: '如何設定 iPad 只能連接學校指定的 Wi-Fi，並禁止連接手機熱點？',
        important: false,
        tags: ['Wi-Fi限制', '熱點', '白名單'],
        answer: `
**雙重設定**：
1.  **Wi-Fi 描述檔**：派送學校的 Wi-Fi 設定給裝置。
2.  **限制描述檔**：
    *   勾選限制 **「連線至非管理式的 Wi-Fi 網路」** (意即：禁止連接非 MDM 派送的 Wi-Fi)。
*   **效果**：iPad 將只能看見並連接上述第 1 點派送的網路，徹底杜絕連熱點。
        `
      },
      {
        id: 'cls-9',
        question: '學生的 iPad 即使在「課堂」中顯示上線，但畫面監看一直是黑屏或權限不足，如何處理？',
        important: false,
        tags: ['畫面黑屏', '權限不足', '課堂故障'],
        answer: `
**解決方案**：
1.  **PreStage 設定確認**：
    *   在 PreStage 註冊的「一般」>「課堂選項」中，確保螢幕觀察權限設為 **「自動授予」** 或 **「提示」**。
2.  **重置課堂權限**：
    *   在 Jamf Pro 對該裝置發送 **「更新資產」**。
    *   或者將學生移出班級再加回，強迫重刷教育設定檔。
3.  **學生端確認**：若設為「提示」，確認學生有在彈出視窗按 **「永遠允許」**。
        `
      },
      {
        id: 'cls-10',
        question: '如何設定主畫面佈局 (Home Screen Layout)，統一全校 iPad 的 App 排列方式？',
        important: false,
        tags: ['主畫面佈局', '排列App', 'Dock'],
        answer: `
**設定**：
1.  建立描述檔 > **「主畫面佈局 (Home Screen Layout)」** Payload。
2.  **Dock**：拖曳 App 到 Dock 區。
3.  **頁面**：新增頁面並拖曳 App 進行排列或分組。
4.  套用後，iPad 主畫面將被鎖定為此樣式，學生無法自行移動圖示。
        `
      },
      {
        id: 'cls-11',
        question: '共享 iPad (Shared iPad) 模式是什麼？如何設定與登入管理式 Apple ID？',
        important: false,
        tags: ['Shared iPad', '共用', '多使用者'],
        answer: `
**概念**：允許多學生用不同 Managed Apple ID 登入同一台 iPad，資料互相隔離。

**設定**：
1.  **PreStage 註冊**：勾選 **「啟用共享 iPad」**。
2.  **重置**：裝置必須重置並重新註冊才會生效。
3.  **登入**：開機後顯示使用者列表，輸入帳密登入，系統會下載個人雲端資料。
        `
      },
      {
        id: 'cls-12',
        question: '如何限制 iPad 的藍牙功能保持開啟，避免學生關閉導致「課堂」斷線？',
        important: false,
        tags: ['藍牙', '限制', '防止關閉'],
        answer: `
**操作**：
1.  **先確認藍牙已開啟**：請務必先手動開啟所有 iPad 的藍牙。
2.  **派送限制**：
    *   限制描述檔 > 功能 > 取消勾選 **「允許修改藍牙設定」**。
3.  **效果**：藍牙開關將反灰，學生無法關閉，確保課堂連線穩定。
        `
      }
    ]
  }
]

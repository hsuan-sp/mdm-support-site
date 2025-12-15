import { QASection } from '../types'

export const data: QASection[] = [
    {
        title: '第四部分：課堂管理與限制 (Classroom Management)',
        items: [
            {
                id: 'cls-1',
                question: '「Apple 課堂」顯示學生離線或無法連線，如何排除？',
                important: true,
                tags: ['故障排除', '藍牙', 'Wi-Fi'],
                answer: `
**運作原理**：
Apple 課堂依賴 **藍牙 (Bluetooth)** 進行近端發現，並透過 **Wi-Fi** 傳輸指令。

**檢測步驟**：
1.  **檢查藍牙與 Wi-Fi**：確認教師機與學生機的藍牙與 Wi-Fi 皆已開啟，且連接至**同一個 Wi-Fi 網段**。
2.  **重置網路設定**：若持續離線，請嘗試在學生機執行 **「重置網路設定」** (設定 > 一般 > 移轉或重置 iPad > 重置)。
3.  **Jamf Pro 檢查**：確認 **「教育設定描述檔 (Education Profile)」** 已成功安裝於裝置上。可嘗試在 Jamf Pro 的「班級」設定中點選儲存，強制重新推送描述檔。
`
            },
            {
                id: 'cls-3',
                question: 'Jamf Teacher 與 Apple 課堂有何不同？',
                tags: ['比較', '功能說明'],
                answer: `
**Apple 課堂 (Classroom)**：
*   **優勢**：即時畫面監看 (螢幕牆)、導覽 App。
*   **限制**：需在藍牙範圍內且同網段。
*   **定位**：課堂當下的互動輔助。

**Jamf Teacher**：
*   **優勢**：不受距離限制 (透過網際網路)，可設定更嚴格的限制 (如隱藏相機、鎖定白名單網頁)。
*   **限制**：無法即時監看畫面。
*   **定位**：測驗環境佈署、長期限制。
`
            },
            {
                id: 'cls-5',
                question: '如何設定 iPad 上課時只能用特定 App (單一 App 模式)？',
                tags: ['App鎖定', '測驗模式'],
                answer: `
**方法 A：使用 Jamf Teacher (老師端)**
1.  在 App 中建立「課程」。
2.  在「允許的 App」中只選擇一個 App。
3.  啟動課程後，學生 iPad 將被鎖定在該 App 中。

**方法 B：使用 Jamf Pro 描述檔 (管理端)**
1.  建立設定描述檔，選擇 **「單一 App 模式 (Single App Mode)」**。
2.  輸入 App Bundle ID。
3.  指派給裝置後，iPad 將無法退出該 App，直到描述檔被移除。適合校園導覽或Kiosk應用。
`
            },
            {
                id: 'cls-6',
                question: '如何限制學生只能瀏覽特定網站 (白名單)？',
                tags: ['網站過濾', '白名單'],
                answer: `
**使用內容過濾器**：
1.  在 Jamf Pro 建立設定描述檔，選擇 **「內容過濾器 (Content Filter)」**。
2.  將過濾類型設為 **「僅限特定網站 (Specific Websites Only)」**。
3.  輸入允許的 URL 清單。
4.  套用後，Safari 將隱藏網址列，且僅能連線至清單中的網站。
`
            },
            {
                id: 'cls-4',
                question: '如何禁止學生修改桌布或裝置名稱？',
                tags: ['限制', '統一管理'],
                answer: `
**設定方式**：
1.  在 Jamf Pro 編輯 **「限制 (Restrictions)」** 描述檔。
2.  在 **「功能 (Functionality)」** 頁籤中：
    *   取消勾選 **「Allow modifying wallpaper」**。
    *   取消勾選 **「Allow modifying device name」**。
3.  儲存並更新描述檔。
`
            },
            {
                id: 'cls-2',
                question: '如何在 Jamf Pro 建立班級並加入師生？',
                tags: ['班級設定', 'Roster'],
                answer: `
**操作流程**：
1.  登入 Jamf Pro > **裝置** > **班級 (Classes)**。
2.  點選 **「+ 新增」** 並輸入班級名稱。
3.  在 **「教師」** 與 **「學生」** 區塊，分別加入對應的使用者帳號。
4.  **先決條件**：該使用者帳號 (User) 必須已在 Jamf Pro 中與其 iPad 完成「配對」。
`
            },
            {
                id: 'cls-9',
                question: '「課堂」畫面監看一直是黑屏或權限不足？',
                tags: ['故障排除', '權限'],
                answer: `
**原因**：未授權螢幕監看權限。

**解決方案**：
檢查 **PreStage 註冊** 設定中的 **「課堂選項 (Classroom Options)」**：
*   確認 **「螢幕觀察權限」** 設為 **「自動授予權限 (Automatically grant permission)」**。
*   若設為「提示」，學生必須在 iPad 上點選「永遠允許」才能讓老師看到畫面。
`
            },
            {
                id: 'cls-11',
                question: '什麼是共享 iPad (Shared iPad)？',
                tags: ['共享模式', '管理式Apple ID'],
                answer: `
**功能**：
允許多位學生使用各自的 **管理式 Apple ID** 登入同一台 iPad。

**特色**：
*   **個人化體驗**：登入後會載入該學生的雲端資料與作業。
*   **資料隔離**：登出後資料自動清除 (或暫存)，保障隱私。
*   **需求**：iPad 需有由 ASM 提供的管理式 Apple ID，且儲存空間需大於 32GB。
`
            },
            {
                id: 'cls-7',
                question: '如何關閉「專用 Wi-Fi 位址」以配合學校防火牆？',
                tags: ['MAC位址', '網路管理'],
                answer: `
**設定描述檔**：
在 **Wi-Fi** 承載資料設定中，勾選 **「停用 MAC 位址隨機化 (Disable MAC Address Randomization)」**。
這樣 iPad 連線時就會使用真實的硬體 MAC 位址，方便網管進行白名單控管。
`
            },
            {
                id: 'cls-16',
                question: 'Jamf Teacher 可以限制相機或 AirDrop 嗎？',
                tags: ['功能限制', '防弊'],
                answer: `
**可以。**
在 Jamf Teacher 建立課程時，可於「限制」選項中關閉：
*   相機 (Camera)
*   AirDrop
*   拼字檢查
*   字典
這些限制僅在課程進行中有效。
`
            }
        ]
    }
]

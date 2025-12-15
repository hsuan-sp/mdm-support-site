import { QASection } from '../types'

export const data: QASection[] = [
    {
        title: '第二部分：裝置註冊與管理 (Device Enrollment)',
        items: [
            {
                id: 'enr-1',
                question: 'iPad 出現「iPad 已停用」或無法解鎖，如何處理？',
                important: true,
                tags: ['密碼解鎖', '清除密碼', '故障排除'],
                answer: `
**情況說明**：
當使用者連續輸入錯誤密碼多次，或完全忘記密碼時，iPad 會進入鎖定狀態。

**解決方案 A：透過 Jamf Pro 遠端解除 (推薦)**
若 iPad **仍連上 Wi-Fi**，這是最快速且**不遺失資料**的方法。
1.  登入 Jamf Pro > 搜尋該裝置。
2.  前往 **「管理 (Management)」** 分頁。
3.  點選 **「清除密碼 (Clear Passcode)」**。指令送達後，鎖定畫面會立即解除。

**解決方案 B：電腦強制回復 (若已斷網)**
若裝置已無網路連線，需透過電腦將其回復原廠設定 (資料將被清除)。
1.  將 iPad 連接至電腦 (Mac/Windows)。
2.  強制進入 **復原模式 (Recovery Mode)**：
    *   **無 Home 鍵機型**：按一下「音量+」，按一下「音量-」，長按「電源鍵」直到出現連接電腦圖示。
    *   **有 Home 鍵機型**：同時長按「Home 鍵」與「電源鍵」直到出現連接電腦圖示。
3.  電腦端軟體 (Finder/Apple Configurator) 會偵測到裝置，請選擇 **「回復 (Restore)」**。
`
            },
            {
                id: 'enr-9',
                question: '如何使用「返回服務 (Return to Service)」讓 iPad 重置後自動連網並重新註冊？',
                important: true,
                tags: ['自動化', '重置', 'iPadOS 17'],
                answer: `
**功能介紹**：
這是 iPadOS 17 導入的強大功能。它允許 MDM 在發送清除指令時，一併附帶 Wi-Fi 設定。這讓 iPad 在重置重啟後，能自動連上網路並完成自動裝置註冊 (ADE)，完全無需人工介入點擊。

**設定步驟**：
1.  在 Jamf Pro 中對目標裝置執行 **「清除裝置 (Erase Device)」**。
2.  在指令視窗中，勾選 **「Return to Service」**。
3.  **關鍵設定**：在下拉選單中選擇一個有效的 **Wi-Fi 設定描述檔**。
    *   *注意：該網路必須不需要 Captive Portal (網頁認證) 即可連上網際網路。*
4.  發送指令後，裝置將自動完成所有後續重置與註冊流程。
`
            },
            {
                id: 'enr-8',
                question: '新採購的 iPad 已在 Apple 校務管理 (ASM) 中，但 Jamf Pro 還沒出現？',
                important: true,
                tags: ['同步', 'ADE', 'ASM'],
                answer: `
**原因**：Jamf Pro 與 Apple 伺服器之間的同步是有時間間隔的。

**手動同步方法**：
1.  登入 Jamf Pro > **設定** > **全域管理** > **自動裝置註冊 (Automated Device Enrollment)**。
2.  點選您的伺服器實例 > **「裝置 (Devices)」** 分頁。
3.  點擊右上角的 **「重新整理 (Refresh)」** 按鈕。
4.  系統將立即向 Apple 查詢最新裝置清單，新設備通常會在 1-2 分鐘內出現。
`
            },
            {
                id: 'enr-2',
                question: '無法自動註冊或回復失敗，如何進入 DFU 模式？',
                tags: ['DFU', '進階維修', 'Apple Configurator'],
                answer: `
若標準的「復原模式」無法修復裝置，您可能需要進入更深層的 **DFU (Device Firmware Update) 模式**。成功進入 DFU 模式時，**iPad 螢幕將保持全黑**。

**操作步驟 (以無 Home 鍵機型為例)**：
1.  將 iPad 連接電腦，開啟 Apple Configurator。
2.  按一下「音量+」，按一下「音量-」，長按「電源鍵」直到螢幕變黑。
3.  **螢幕變黑瞬間**，同時按住「音量-」與「電源鍵」約 5 秒。
4.  放開「電源鍵」，但**持續按住「音量-」**。
5.  觀察電腦畫面，若出現 **DFU** 字樣且 iPad 螢幕無畫面，即成功。接著選擇「回復」即可重寫韌體。
`
            },
            {
                id: 'enr-3',
                question: '家長會捐贈或自行購買的 iPad，如何加入 Apple 校務管理 (ASM)？',
                tags: ['Apple Configurator', '手動納管'],
                answer: `
非經銷商管道取得的裝置，可透過 **Apple Configurator** 手動加入。

**必備條件**：
*   一台安裝 Apple Configurator 的 Mac。
*   iPad 需處於「Hello」歡迎畫面。

**操作重點**：
1.  連接 iPad，在 Apple Configurator 中選擇 **「準備 (Prepare)」**。
2.  勾選 **「加入 Apple 校務管理」** 與 **「監管裝置」**。
3.  登入學校的 ASM 管理員帳號。
4.  完成流程後，iPad 會被加入 ASM 的「已手動新增」群組。
5.  **重要提示**：手動加入的裝置有 **30 天猶豫期**，期間內使用者可在設定中自行移除監管。30 天後將永久鎖定。
`
            },
            {
                id: 'enr-4',
                question: '重置後卡在「遠端管理」登入畫面，或顯示「無效的描述檔」',
                tags: ['PreStage', '故障排除'],
                answer: `
**常見原因與解法**：

1.  **PreStage 範圍未勾選**：
    *   這是最常見的原因。請檢查 Jamf Pro > **PreStage 註冊** > **範圍 (Scope)**，確認該裝置是否有被勾選並儲存。

2.  **時區或網路錯誤**：
    *   請按 iPad 返回鍵，重新連接 Wi-Fi，確保網路通暢且時間同步。

3.  **不需要帳號卻跳出登入框**：
    *   請檢查 PreStage 設定中的 **「一般」**，確認是否意外勾選了 **「需要認證 (Require Authentication)」**。
`
            },
            {
                id: 'enr-5',
                question: '如何讓 iPad 重置後自動改回原本的資產編號 (如 112-A01)？',
                tags: ['MUT', '裝置命名'],
                answer: `
Jamf Pro 原生不支援「重置後保留自訂名稱」。你需要兩段式操作：

**步驟 1：標準化初次命名**
在 PreStage 註冊設定中，選擇 **強制命名** 為 **Serial Number (序號)**。這樣所有重置後的 iPad 至少會有統一格式 (序號)。

**步驟 2：使用 MUT 批次更名**
裝置註冊回來後，使用 **The MUT (Mass Update Tool)** 工具：
1.  準備 CSV 檔：欄位包含 **Serial Number** 與對應的 **Display Name**。
2.  將 CSV 拖入 MUT 並執行。Jamf 會立即發送更名指令，將裝置改回您指定的資產編號。
`
            },
            {
                id: 'enr-7',
                question: '「清除裝置 (Erase)」與「清除密碼 (Clear Passcode)」有何不同？',
                tags: ['指令比較', '概念'],
                answer: `
這兩個指令雖然聽起來很像，但後果截然不同：

*   **清除密碼 (Clear Passcode)**：
    *   僅移除螢幕鎖。
    *   **資料保留**，App 保留，Wi-Fi 保留。
    *   適用於：學生忘記密碼。

*   **清除裝置 (Erase Device)**：
    *   **格式化** 整台設備，回復出廠狀態。
    *   **資料全刪**。
    *   適用於：學期末回收、裝置嚴重異常需重灌、裝置遺失。
`
            },
            {
                id: 'enr-11',
                question: '裝置顯示 Unmanaged 或長期失聯，如何重新納管？',
                tags: ['重新註冊', '故障排除'],
                answer: `
**確認狀態**：
若 Jamf 後台顯示該裝置為 **Unmanaged**，代表 MDM 描述檔已失效或被移除。

**標準修復流程**：
最穩定且乾淨的解法是 **重新執行自動裝置註冊 (ADE)**。
1.  手動將 iPad **「清除所有內容與設定」** (若有密碼鎖需透過電腦回復)。
2.  確認該裝置在 **ASM** 中已指派給 Jamf Pro。
3.  確認該裝置在 **PreStage 註冊** 的範圍內。
4.  iPad 開機連網後，即可自動下載描述檔完成修復。
`
            },
            {
                id: 'enr-12',
                question: '老師個人的 iPad (BYOD) 想加入學校管理，但不希望資料被監控？',
                tags: ['使用者註冊', 'BYOD', '隱私'],
                answer: `
可以使用 Apple 的 **使用者註冊 (User Enrollment)** 模式。

**隱私與管理並存**：
在此模式下，iPad 會建立一個獨立的加密磁區存放學校資料 (App、帳號)。
*   **學校權限**：僅能管理這個工作磁區。無法看見老師的私人照片、無法得知私人 App 下載紀錄、無法清除整台裝置。
*   **老師權限**：保有完全的隱私與裝置控制權。

**如何開始**：
老師需在 **「設定」>「一般」>「VPN 與裝置管理」** 中，選擇 **「登入學校或工作帳號」**，並輸入學校配發的 **管理式 Apple ID** 即可啟動流程。
`
            },
            {
                id: 'enr-13',
                question: '若將 iPad 借給友校使用，會發生 MDM 衝突嗎？',
                tags: ['借用', 'MDM衝突'],
                answer: `
**會。一台 iPad 只能接受一個 MDM 管理。**

**正確借用流程**：
1.  **貴校 (出借方)**：需先在 **ASM** 中將該裝置 **「取消指派 (Unassign)」**，並在 Jamf Pro 中刪除紀錄。
2.  **清除裝置**：將 iPad 格式化。
3.  **友校 (借用方)**：透過 Apple Configurator 將 iPad 加入他們自己的 ASM，並指派給他們的 MDM 伺服器。
`
            },
            {
                id: 'enr-14',
                question: '除了重置 (ADE)，還有其他註冊方式嗎？(網頁註冊)',
                tags: ['使用者啟動註冊', '網頁註冊'],
                answer: `
有的，稱為 **使用者啟動註冊 (User-Initiated Enrollment, UIE)**。

**操作方式**：
在 iPad 的 Safari 瀏覽器直接輸入貴校的註冊網址 (例如 \`https://schoolname.jamfcloud.com/enroll\`)，登入後即可下載描述檔。

**限制**：
此方式註冊的裝置通常**不具備監管 (Supervision)** 身分，管理權限較低 (例如無法設定單一 App 模式、無法靜默更新 App)，且使用者可隨時移除管理，因此僅建議用於臨時測試。
`
            },
            {
                id: 'enr-15',
                question: '如何防止學生自行刪除 MDM 描述檔？',
                tags: ['安全性', '防止移除'],
                answer: `
這是透過 **自動裝置註冊 (ADE)** 的設定來達成的。

**檢查設定**：
請前往 Jamf Pro > **PreStage 註冊** > **一般**。
確認已勾選 **「防止取消註冊 (Prevent Unenrollment)」**。
設定生效後，iPad 設定中的描述檔頁面將隱藏移除按鈕，確保管理權限不被破壞。
`
            }
        ]
    }
]

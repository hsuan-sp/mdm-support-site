import { QASection } from '../types'

export const data: QASection[] = [
  {
    title: '第二部分：裝置註冊、納管與重置 (Enrollment & Reset)',
    items: [
      {
        id: 'enr-1',
        question: '[常用] 平板被學生設定了密碼且已忘記，導致無法解鎖，如何在不登入的情況下重置？',
        important: true,
        tags: ['密碼鎖', '重置', '解鎖'],
        answer: `
**方法 A：透過 Jamf Pro 遠端清除密碼 (最推薦，需聯網)**
若 iPad **仍有 Wi-Fi 連線**（右上角有訊號）：
1.  登入 Jamf Pro > 搜尋該裝置。
2.  點選 **「管理 (Management)」** > **「清除密碼 (Clear Passcode)」**。
3.  指令送達後，iPad 密碼鎖會直接解除，無需清除資料。

**方法 B：使用電腦強制回復 (若已斷網)**
若 iPad 已斷網，必須使用電腦強制重灌，**此動作會清除所有資料**。
1.  將 iPad 連接電腦 (Mac/PC)。
2.  **強制進入復原模式**：
    *   **無 Home 鍵機型**：按一下「音量+」，按一下「音量-」，長按「電源鍵」直到出現連接電腦圖示。
    *   **有 Home 鍵機型**：同時長按「Home鍵」+「電源鍵」，直到出現連接電腦圖示。
3.  電腦端軟體 (Finder/iTunes/Apple Devices) 會跳出提示，選擇 **「回復 (Restore)」**。

---
**參考文件**：
*   [如果忘記 iPad 密碼 (Apple 支援)](https://support.apple.com/zh-tw/119858)
        `
      },
      {
        id: 'enr-2',
        question: '[常用] 使用 Apple Configurator (AC2) 重置平板時，卡在「等待裝置」或出現錯誤代碼，如何解決？',
        important: false,
        tags: ['AC2', 'DFU', '錯誤代碼'],
        answer: `
若標準回復失敗 (錯誤碼 4013, 9, 4005)，需進入 **DFU 模式** 強制寫入韌體。

**如何進入 DFU 模式 (黑畫面模式)**：
*關鍵：成功時螢幕必須是全黑的。*

**A. 無 Home 鍵機型 (Face ID/Air 4+/iPad 10)**：
1.  接上電腦，開啟 AC2。
2.  按一下「音量+」，按一下「音量-」，長按「電源鍵」約 10 秒直到黑屏。
3.  黑屏瞬間，**同時按住「電源鍵」+「音量-」** 約 5 秒。
4.  **放開「電源鍵」**，繼續按住「音量-」約 10 秒。
5.  AC2 顯示 **"DFU"** 圖示即成功。

**B. 有 Home 鍵機型**：
1.  接上電腦，開啟 AC2。
2.  同時長按「電源鍵」+「Home 鍵」約 8-10 秒直至黑屏。
3.  **放開「電源鍵」**，繼續按住「Home 鍵」約 5 秒以上。
4.  AC2 顯示 **"DFU"** 圖示即成功。

成功後在 AC2 對裝置按右鍵 > **「回復 (Restore)」**。

---
**參考文件**：
*   [修復或回復 Apple 裝置 (Apple Configurator 手冊)](https://support.apple.com/zh-tw/guide/apple-configurator-mac/cad367dc4593/mac)
        `
      },
      {
        id: 'enr-3',
        question: '如何將尚未納管（或已脫管）的 iPad，透過 AC2 手動加入 Apple School Manager？',
        important: false,
        tags: ['手動納管', 'AC2', 'ASM'],
        answer: `
**詳細步驟**：
1.  **準備**：iPad 需在 Hello 畫面。Mac 需安裝 Apple Configurator 並登入 ASM 管理員帳號。
2.  **建立 Wi-Fi 描述檔**：在 AC2 預先製作好 Wi-Fi 設定檔。
3.  **執行準備 (Prepare)**：
    *   選取裝置 > **「準備」** > **「手動設定」**。
    *   勾選 **「將裝置加入 Apple 校務管理」** 與 **「監管裝置」**。
    *   **不要**勾選「註冊 MDM」(稍後在 ASM 指派)。
    *   登入組織帳號，並在網路步驟載入刚才的 Wi-Fi 描述檔。
4.  **ASM 端指派**：
    *   流程跑完後，登入 [ASM](https://school.apple.com)。
    *   前往 **「裝置」** > 篩選來源 **「已手動新增」**。
    *   選取該 iPad > **「編輯 MDM 伺服器」** > 指派給 **Jamf Pro**。
5.  **Jamf Pro 同步**：
    *   回到 Jamf Pro > 自動裝置註冊 > 重新整理，確認裝置出現在 PreStage 範圍內。
6.  **注意 30 天猶豫期**：手動加入的裝置在前 30 天內可被使用者自行移除監管，30 天後將永久綁定。
        `
      },
      {
        id: 'enr-4',
        question: '裝置重置後，卡在「遠端管理」登入畫面，或顯示「無效的描述檔」，該怎麼辦？',
        important: false,
        tags: ['遠端管理', '卡住', 'PreStage'],
        answer: `
**原因**：通常是裝置雖然指派給了 Jamf，但在 Jamf 的 PreStage 註冊設定中「未勾選」該裝置。

**解決方案**：
1.  **檢查 PreStage 範圍**：
    *   登入 Jamf Pro > **裝置** > **預先階段註冊 (PreStage Enrollments)**。
    *   點進設定檔 > **範圍 (Scope)**。
    *   搜尋該裝置序號，**務必打勾**，然後按 **儲存**。
2.  **強制重抓**：
    *   iPad 按「返回」鍵退回 Wi-Fi 畫面，等待 10 秒後再次點擊「下一步」。
3.  **取消驗證需求**：
    *   若卡在帳號密碼輸入畫面，請在 PreStage 的「一般」設定中，取消勾選 **「需要認證 (Require Authentication)」**。
        `
      },
      {
        id: 'enr-5',
        question: '如何設定讓 iPad 重置後「自動」抓回原本的裝置名稱與群組設定？',
        important: false,
        tags: ['裝置命名', 'MUT', '自動化'],
        answer: `
**最佳實踐流程**：
Jamf 無法直接記憶重置前的名稱，建議採用「序號命名 + MUT 批次更名」策略。

**1. 設定 PreStage 命名規則**：
*   在 PreStage 註冊的 **「一般」** 設定中，勾選 **「強制行動裝置名稱 (Enforce Mobile Device Names)」** 並選擇 **「Serial Number (序號)」**。
*   這樣重置後，裝置會先變成序號 (如 DMPQ...)，避免全變成 "iPad"。

**2. 使用 The MUT 批次寫入名稱**：
*   下載 Mac App **The MUT (Mass Update Tool)**。
*   準備 CSV 檔包含三欄：\`Mobile Device Serial\`, \`Display Name\` (如 111-A01), \`Enforce Name\` (填 TRUE)。
*   將 CSV 拖入 MUT 並執行更新。
*   Jamf 會發送指令將裝置改回正確名稱，並依名稱自動歸入智慧型群組。
        `
      },
      {
        id: 'enr-6',
        question: 'Jamf Pro 中的「PreStage 註冊」設定是什麼？如何調整開機設定輔助程式？',
        important: false,
        tags: ['PreStage', '開機設定', '略過'],
        answer: `
**建議設定 (零接觸部署)**：
前往 **Jamf Pro** > **裝置** > **預先階段註冊**。

1.  **一般 (General)**：
    *   **自動推進 (Automatically Advance)**：(iPadOS 17+) 勾選，可全自動跳轉至桌面。
    *   **監管 (Supervise)**：必勾。
    *   **防止取消註冊**：必勾。
    *   **共用 iPad**：一般 1:1 載具請勿勾選。
2.  **設定輔助程式 (Setup Assistant)**：
    *   雖然可以全選略過，但若您**未啟用**「Return to Service」且需要「遺失模式」，建議**不要略過「定位服務」**，以便開機時手動開啟定位。
        `
      },
      {
        id: 'enr-7',
        question: '什麼是「清除裝置 (Erase Device)」指令？它與「清除密碼 (Clear Passcode)」有何不同？',
        important: false,
        tags: ['指令比較', '清除裝置', '清除密碼'],
        answer: `
**清除密碼 (Clear Passcode)**：
*   **作用**：僅移除螢幕 PIN 碼。
*   **結果**：資料保留，Wi-Fi 連線保留。
*   **時機**：學生忘記密碼但裝置在連線中。

**清除裝置 (Erase Device)**：
*   **作用**：**格式化**整台 iPad，恢復原廠設定。
*   **結果**：資料全刪，Wi-Fi 設定消失（除非使用 Return to Service）。
*   **時機**：裝置換人使用、嚴重故障修復、遺失保密。
        `
      },
      {
        id: 'enr-8',
        question: '新購置的 iPad 沒有出現在 Jamf 後台，但在 ASM 裡有看到，如何同步？',
        important: false,
        tags: ['ASM同步', '裝置遺失'],
        answer: `
Jamf Pro 預設每日同步一次。若需立即看到新裝置，請手動強制同步：

1.  登入 **Jamf Pro**。
2.  前往 **設定** > **全域管理** > **自動裝置註冊**。
3.  點選該 ASM 實例 (如學校名稱)。
4.  點選 **「Devices (裝置)」** 分頁。
5.  點擊右上角 **「Refresh (重新整理)」** 按鈕。
6.  等待 1-2 分鐘後，新裝置即會出現。
        `
      },
      {
        id: 'enr-9',
        question: '如何使用 Jamf 的「Return to Service (返回服務)」功能，讓裝置重置後自動連網並完成設定？',
        important: true,
        tags: ['Return to Service', 'iPadOS 17', '自動連網'],
        answer: `
**功能**：發送清除指令時，將 Wi-Fi 設定暫存在硬體中，讓 iPad 重置後能自動連回 Wi-Fi 並向 MDM 報到，達成真正的**零接觸重置**。

**需求**：
*   iPadOS 17.0+
*   Jamf Pro 內已建立有效的 Wi-Fi 描述檔 (無憑證認證)。

**操作**：
1.  在 Jamf Pro 對裝置發送 **「清除裝置 (Erase Device)」**。
2.  在彈出視窗勾選：
    *   **Clear Activation Lock (清除啟用鎖定)**
    *   **Return to Service (返回服務)**
3.  確認選擇了正確的 Wi-Fi 設定檔。
4.  發送指令。
        `
      },
      {
        id: 'enr-10',
        question: '平板重置後，裝置名稱變回 "iPad"，如何大量重新命名（使用 MUT 工具或 CSV 匯入）？',
        important: false,
        tags: ['MUT', '重新命名', 'CSV'],
        answer: `
請參考 Q5 的說明，使用 **The MUT (Mass Update Tool)** 是最標準的解法。

**操作簡述**：
1.  下載模板 CSV。
2.  填入 \`Serial Number\` 對應 \`Display Name\`。
3.  將 \`Enforce Name\` 設為 TRUE。
4.  拖入 MUT 軟體並提交。
        `
      },
      {
        id: 'enr-11',
        question: '裝置在 Jamf 後台顯示「Unmanaged (未受監管)」或失去連線超過 30 天，如何重新納管？',
        important: false,
        tags: ['脫管', '重新納管', 'Unmanaged'],
        answer: `
**方法一：嘗試恢復連線 (若只是斷網)**
1.  手動連接穩定的 Wi-Fi (如熱點)。
2.  執行 **「重置網路設定」** (設定 > 一般 > 移轉或重置 > 重置)。
3.  打開 Jamf Trust App 觸發同步。

**方法二：清除重置 (若已明確脫管)**
若後台顯示 Unmanaged，最快解法是**重跑 ADE 流程**：
1.  確認 ASM 中該裝置指派正確。
2.  執行 **「清除所有內容與設定」**。
3.  重開機後，在「遠端管理」畫面點選下一步，即可重新納管。
        `
      },
      {
        id: 'enr-12',
        question: '老師自行購買的 iPad 或 BYOD 裝置，如何納入學校 MDM 管理但不影響個人 Apple ID？',
        important: false,
        tags: ['BYOD', '使用者註冊', '隱私'],
        answer: `
使用 **「使用者註冊 (User Enrollment)」** 模式，可在裝置上區隔「個人空間」與「學校空間」。

**特點**：
*   學校**無法**看到個人照片、App 或清除整台裝置。
*   學校**只能**管理由 MDM 派送的 App 與帳號。

**操作**：
1.  **管理員**：在 Jamf Pro 開啟「使用者註冊」並提供註冊連結/QR Code。
2.  **老師**：在個人 iPad 前往 **設定 > 一般 > VPN 與裝置管理 > 登入學校帳號**。
3.  輸入學校配發的 **管理式 Apple ID** (非個人 ID)。
4.  完成後，設定中會出現兩個 Apple ID，互不干擾。

---
**參考文件**：
*   [使用者註冊與裝置註冊的差異 (Apple)](https://support.apple.com/zh-tw/guide/deployment/dep23db2064d/web)
        `
      }
    ]
  }
]

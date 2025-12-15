import { QASection } from '../types'

export const data: QASection[] = [
  {
    title: '第七部分：Mac 電腦進階管理 (Mac Management)',
    items: [
      {
        id: 'mac-2',
        question: 'Mac 需要綁定 AD (Active Directory) 嗎？',
        important: true,
        tags: ['AD', '身分認證', 'Jamf Connect'],
        answer: `
**現代化建議：不要綁定 AD (No-Bind)。**

**理由**：
*   **行動化**：筆電常在校外使用，脫離 AD 網域會導致密碼同步失敗、登入延遲。
*   **Apple 趨勢**：Apple 正推動 **平台單一登入 (Platform SSO)** 取代傳統綁定。

**替代方案**：
使用 **Jamf Connect** 或 **Kerberos SSO Extension**。
這能讓使用者用 Google/Microsoft 帳號登入 Mac，同時確保密碼同步，而無需將電腦綁死在內網 AD 中。
`
      },
      {
        id: 'mac-1',
        question: '如何管理 Mac 的本機管理者權限 (Local Admin)？',
        tags: ['帳號權限', 'LAPS', '資安'],
        answer: `
**最佳實踐**：
1.  **日常使用標準帳戶**：使用者平時應使用「標準帳戶」操作，避免惡意軟體輕易獲得根權限。
2.  **LAPS (Local Administrator Password Solution)**：
    *   透過 Jamf Pro 的 **LAPS** 功能，讓每台 Mac 的管理員密碼都**隨機生成**且**定期自動更換**。
    *   需要維修時，再由管理員至 Jamf 後台查詢當下的有效密碼。
`
      },
      {
        id: 'mac-3',
        question: '如何派送非 App Store 的軟體 (如 Chrome, Adobe, Office)？',
        tags: ['軟體派送', 'Patch Management'],
        answer: `
**使用 Jamf Pro 的 Policy (原則)**：
1.  **打包**：將安裝檔 (.pkg / .dmg) 上傳至 Jamf 分發點。
2.  **建立 Policy**：設定觸發時機 (如使用者登入時、自助服務)。
3.  **App Installers**：Jamf 提供由官方維護的 **App Installers** 庫，可全自動部署並更新 Chrome、Zoom 等數百種常用軟體，無需手動打包。
`
      },
      {
        id: 'mac-5',
        question: '為什麼 MDM 要求開啟 FileVault？忘記密碼怎麼辦？',
        important: true,
        tags: ['FileVault', '資料加密', '資安'],
        answer: `
**FileVault (全磁碟加密)**：
這是保護個資的最後防線。即便硬碟被拔走，沒密碼也就無法讀取。

**忘記密碼救援**：
Jamf Pro 會在啟用加密時收集 **「個人復原金鑰 (Personal Recovery Key)」**。
若使用者忘記登入密碼，管理員可至後台查詢該機器的金鑰來協助重置密碼。
`
      },
      {
        id: 'mac-6',
        question: 'Jamf 的 Script (腳本) 功能可以做什麼？',
        tags: ['自動化', 'Shell Script', '進階管理'],
        answer: `
**無限的可能性**：
Jamf Pro 支援執行 **Shell Script (Bash/Zsh)**。
凡是 GUI 介面沒做的、沒有 Payload 支援的，通通寫成 Script 解決。
*   *範例*：修改 Dock 延遲時間、刪除特定暫存檔、跳出客製化公告視窗 (Jamf Helper)。
`
      },
      {
        id: 'mac-14',
        question: '什麼是 Nudge？如何優雅地催促使用者更新 macOS？',
        tags: ['Nudge', '系統更新', '使用者體驗'],
        answer: `
**痛點**：強制更新通常會直接重開機中斷使用者工作，引發民怨。

**解決方案：Nudge**
這是一個開源工具 (Jamf 社群極力推薦)。
*   它會跳出一個**自訂視窗** (可放學校 Logo、自訂勸導文案)。
*   隨著截止期限逼近，視窗跳出頻率會變高，最後佔據全螢幕。
*   這給予使用者緩衝期，達成「溫柔但堅定」的更新合規。
`
      },
      {
        id: 'mac-8',
        question: '安裝軟體顯示「來自未識別的開發者」無法打開？',
        tags: ['Gatekeeper', '安全性'],
        answer: `
**Gatekeeper 機制**：
macOS 預設僅信任 App Store 與已公證 (Notarized) 的軟體。

**解決法**：
*   **單次允許**：按住 **Control 鍵** 不放，點選該 App > **打開** > 再點一次 **打開**。
*   **MDM 設定**：不建議由 MDM 全面關閉 Gatekeeper，這會大幅降低資安防護。
`
      },
      {
        id: 'mac-15',
        question: '如何防止學生進入 Recovery Mode 格式化電腦？',
        tags: ['防篡改', 'Recovery Lock'],
        answer: `
**防護機制**：
*   **Intel Mac**：設定 **韌體密碼 (Firmware Password)**。
*   **Apple Silicon (M系列)**：設定 **Recovery Lock (復原鎖定)**。
設定後，進入復原模式必須輸入管理員密碼，否則無法執行洗機操作。
`
      }
    ]
  }
]

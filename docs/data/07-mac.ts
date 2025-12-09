import { QASection } from '../types'

export const data: QASection[] = [
  {
    title: '第七部分：Mac 管理與其他進階設定 (Mac & Advanced)',
    items: [
      {
        id: 'mac-1',
        question: '如何在 Jamf Pro 中管理 Mac 電腦（安裝軟體、印表機設定）？',
        important: false,
        tags: ['Mac管理', 'Policy', '印表機'],
        answer: `
**核心：原則 (Policies)**
Mac 管理主要靠 Policy 執行：
1.  **安裝軟體**：
    *   上傳 \`.pkg\` 到 **Packages**。
    *   建立 Policy > 設定 Trigger (如 Check-in) > 加入 Package。
2.  **印表機**：
    *   建立 Policy > **Printers Payload** > 輸入 IP 與驅動資訊。
        `
      },
      {
        id: 'mac-2',
        question: 'Mac 電腦如何設定「排程開關機」，配合電腦教室上課時間？',
        important: false,
        tags: ['排程', '開關機', 'pmset', '終端機'],
        answer: `
使用 **pmset** 指令 (可透過 Jamf 派送 Script)。

**範例**：
*   **平日 08:00 開機**：
    \`sudo pmset repeat startup MTWRF 08:00:00\`
*   **平日 17:00 關機**：
    \`sudo pmset repeat shutdown MTWRF 17:00:00\`
*   **取消排程**：
    \`sudo pmset repeat cancel\`
        `
      },
      {
        id: 'mac-3',
        question: '如何使用 ARD (Apple Remote Desktop) 遠端廣播或控制學生 Mac 電腦？',
        important: false,
        tags: ['ARD', '遠端控制', '廣播'],
        answer: `
**需求**：
1.  教師機安裝 **Apple Remote Desktop** App。
2.  學生機開啟 **「遠端管理」** (系統設定 > 一般 > 共享)。
3.  同一網段。

**功能**：
*   **觀察**：監看螢幕牆。
*   **控制**：接管鍵盤滑鼠。
*   **共享螢幕**：廣播老師畫面給學生。
*   **鎖定螢幕**：讓學生專心。
        `
      },
      {
        id: 'mac-4',
        question: 'Mac 電腦無法連上學校 Wi-Fi (802.1x 認證) 或憑證信任問題，如何解決？',
        important: false,
        tags: ['802.1x', 'Wi-Fi', '憑證'],
        answer: `
必須派送包含 **憑證** 的描述檔：
1.  上傳學校 Radius 伺服器憑證 (.cer) 到描述檔 Certificate Payload。
2.  在 Network Payload 設定 Wi-Fi SSID 與 WPA2 Enterprise。
3.  在 Trust 頁籤勾選剛上傳的憑證。
4.  派送後，Mac 會自動信任該網路，使用者僅需輸入帳密。
        `
      },
      {
        id: 'mac-5',
        question: '如何透過 Jamf 限制 Mac 使用者使用 USB隨身碟等外接儲存裝置？',
        important: false,
        tags: ['USB限制', '外接裝置'],
        answer: `
**設定**：
1.  建立描述檔 > **限制 (Restrictions)** > **媒體 (Media)**。
2.  勾選 **「拒絕 (Deny)」** 外接磁碟、光碟等。
*   若需唯讀或特定品牌限制，需升級使用 **Jamf Protect**。
        `
      },
      {
        id: 'mac-6',
        question: '如何重灌 Mac 電腦（Apple Silicon M1/M2/M3 與 Intel 機型的差異）？',
        important: true,
        tags: ['重灌', 'M1', 'Intel', '復原模式'],
        answer: `
**Apple 晶片 (M1/M2/M3...)**：
1.  關機。
2.  **長按電源鍵** 直到出現「選項」齒輪。
3.  進入 macOS 復原 > 磁碟工具程式清除 > 重新安裝 macOS。

**Intel 晶片**：
1.  關機。
2.  開機立即按 **Cmd + R** (本機回復) 或 **Option + Cmd + R** (網路回復)。
        `
      },
      {
        id: 'mac-7',
        question: 'Mac 上的 Chrome 或 Safari 首頁被綁架或出現大量廣告，如何清除？',
        important: false,
        tags: ['網頁綁架', '廣告', '惡意軟體'],
        answer: `
**排查**：
1.  **延伸功能**：Safari/Chrome 設定中移除不明外掛。
2.  **描述檔**：系統設定 > 隱私權 > 描述檔，檢查有無不明描述檔被惡意安裝。
3.  **掃描**：使用 Malwarebytes for Mac 掃描。
        `
      },
      {
        id: 'mac-8',
        question: '如何設定 Mac 的多使用者帳號與權限（管理者 vs 標準使用者）？',
        important: false,
        tags: ['帳號管理', '多使用者'],
        answer: `
**Jamf Pro 部署**：
*   建立描述檔 > **本機使用者帳號 (Local User Account)**。
*   設定帳號 (如 student)、密碼、類型 (標準 Standard)。
*   派送後，所有電腦即會自動建立該公用帳號。
        `
      },
      {
        id: 'mac-9',
        question: 'Apple TV 無法連線或無法被 iPad 投影 (AirPlay)，該檢查哪些設定？',
        important: false,
        tags: ['AirPlay', 'Apple TV', 'Bonjour'],
        answer: `
**排查**：
1.  **同網段**：iPad 與 Apple TV 必須在同 SSID。
2.  **AP 隔離**：確認網管未開啟隔離功能。
3.  **藍牙**：開啟以輔助探索。
4.  **MDM 限制**：確認描述檔未勾選「禁止 AirPlay」。
        `
      },
      {
        id: 'mac-10',
        question: '如何將 Mac 加入網域 (AD) 或解除綁定？',
        important: false,
        tags: ['AD', '加入網域', '解除綁定'],
        answer: `
**加入**：
*   建立描述檔 > **目錄綁定 (Directory Bindings)**。
*   輸入 AD 資訊與綁定帳號。
*   建議勾選「製作行動帳號」。

**解除**：
*   將電腦從該描述檔 Scope 移除，Jamf 即會自動解除綁定。
        `
      }
    ]
  }
]

import { QASection } from '../types'

export const data: QASection[] = [
  {
    title: '第一部分：帳號、憑證與伺服器管理 (Account & Server Management)',
    items: [
      {
        id: 'acc-1',
        question: '[緊急] 登入 Jamf Pro/School 時顯示「您的帳戶已被鎖定」或密碼錯誤，該如何處理？',
        important: true,
        tags: ['帳號鎖定', '密碼重置', '緊急'],
        answer: `
**問題描述**：嘗試登入 MDM 後台時，顯示 "Account locked" 或密碼錯誤，即使嘗試多次仍無法登入。

**解決方案**：

1.  **Jamf Pro (精進計畫/校內自購)**：
    *   若您使用的是教育部統一配發的帳號（如 \`schooladmin\`），請聯繫教育部數位學習推動辦公室或我們協助解鎖。
    *   若為學校自行建立的帳號，請聯絡校內擁有「管理者 (Administrator)」權限的同仁登入後台，前往 **設定 (Settings) > 系統設定 > 管理員帳戶**，找到被鎖定的帳號進行解鎖或重置密碼。
    *   若所有管理員皆無法登入，請立即聯繫我們。

2.  **Jamf School**：
    *   Jamf School 近期強制執行較嚴格的密碼政策（需 15 碼以上），若久未登入可能需重置。
    *   請點擊登入畫面下方的 **「Forgot Password?」**，輸入您的 Email。系統會寄送重置信件，請依照信中連結設定新密碼即可。

---
**參考文件**：
*   [Jamf Pro 管理員帳戶設定](https://learn.jamf.com/bundle/jamf-pro-documentation/page/Jamf_Pro_User_Accounts_and_Groups.html)
        `
      },
      {
        id: 'acc-2',
        question: '[緊急] 收到「Apple 推播通知服務 (APNs) 憑證即將到期」或已過期的通知，會影響平板運作嗎？如何更新？',
        important: true,
        tags: ['APNs', '憑證更新', '緊急'],
        answer: `
**影響**：若 APNs 憑證過期，MDM 將**完全失去**與 Apple 裝置通訊的能力，無法發送任何指令（如鎖定、派送 App、更新資產）。

**⚠️ 警告：請務必點選「Renew (更新)」，切勿點選「Create New (建立新的)」憑證，否則所有已納管的 iPad 可能必須全部收回重置。**
**若當初施作時是由我們負責更新憑證，請勿自行進行任何操作，立刻聯絡我們協助更新 APNs 憑證。**

**操作步驟 (Jamf Pro 為例)**：
1.  登入 **Jamf Pro** > **設定 (齒輪圖示)** > **全域管理** > **推播憑證 (Push Certificates)**。
2.  點選即將到期的憑證名稱，按一下右下角的 **「更新 (Renew)」**。
3.  **下載簽署要求 (CSR)**：點選 Download signed CSR from Jamf，下載並儲存 \`JAMFSignedCSR.plist\` 檔案。
4.  **前往 Apple 入口網站**：點選連結前往 [Apple Push Certificates Portal](https://identity.apple.com/pushcert/)，並登入**當初建立此憑證的 Apple ID**。
    *   *(極為重要：必須是同一個 ID，否則憑證無法續期)*
5.  **更新憑證**：在 Apple 網站列表中找到對應的憑證（確認過期日期或備註），點選 **"Renew"**，上傳剛剛下載的 \`JAMFSignedCSR.plist\` 檔案。
6.  **下載並上傳**：Apple 網站會生成一個新的 \`.pem\` 檔案，下載後回到 Jamf Pro 介面，上傳此檔案並儲存。

---
**參考文件**：
*   [Apple Push Certificates Portal](https://identity.apple.com/pushcert/)
*   [Jamf Pro 推播憑證設定](https://learn.jamf.com/bundle/jamf-pro-documentation/page/Push_Certificates.html)
        `
      },
      {
        id: 'acc-3',
        question: '[緊急] Jamf 後台顯示「自動裝置註冊 (ADE/DEP) 伺服器權杖」或「大量採購 (VPP) 伺服器權杖」過期，該如何更新？',
        important: true,
        tags: ['ADE', 'VPP', 'Token', '過期'],
        answer: `
**影響**：
*   **ADE (DEP) 過期**：新購或重置後的 iPad 無法自動納管。
*   **VPP 過期**：無法購買或派送 App，現有 App 可能無法更新。

**解決方案**：
與推播憑證不同，這兩個憑證可以由任何有「管理員」或「機構經理」權限的帳號更換。請登入 **[Apple 校務管理 (ASM)](https://school.apple.com/)** 取得新的權杖 (Token)。

**1. 更新自動裝置註冊 (ADE/DEP) 權杖**：
*   **ASM 端**：登入 ASM > 左下角帳戶名稱 > **偏好設定** > **裝置管理服務** > 點選對應的伺服器 (通常為 \`TWMOETPxxxxxx.jamfcloud.com\`) > **下載代號**。
*   **Jamf Pro 端**：**設定** > **全域管理** > **自動裝置註冊** > 點選該實例 > **編輯** > 上傳代號檔案 > **儲存**。

**2. 更新大量採購 (VPP/Apps & Books) 權杖**：
*   **ASM 端**：登入 ASM > 左下角帳戶名稱 > **偏好設定** > **付款與帳單** > **App** > **內容代號** > 找到對應的位置 (Location) > **下載代號**。
*   **Jamf Pro 端**：**設定** > **全域管理** > **大量採購** > 點選對應的位置名稱 > **編輯** > 上傳代號檔案 > **儲存** > 點選 **「回收服務代號 (Reclaim Service Token)」** 以確保生效。
        `
      },
      {
        id: 'acc-4',
        question: '登入 Apple School Manager (ASM) 時，系統要求同意新的條款與約定，若不同意會有什麼影響？',
        important: true,
        tags: ['ASM', '條款', '同步失敗'],
        answer: `
**影響**：若未同意新條款，系統會暫停 ASM 的 API 存取權限。這會導致 Jamf 無法同步新裝置、無法更新 VPP 授權，甚至無法派送 App。

**解決方案**：
1.  請使用具備 **「管理員 (Administrator)」** 權限的 Apple ID 登入 [https://school.apple.com/](https://school.apple.com/)。
    *   *注意：一般「人員」、「學生」或「內容經理」帳號無法執行同意條款的動作。*
2.  登入後，網頁會自動跳出新的條款與約定視窗（或顯示於上方橫幅）。
3.  請檢視內容並全數勾選 **「同意」**。
4.  完成後，建議手動登入 Jamf Pro 並手動執行一次資產更新，以確保連線恢復正常。
        `
      },
      {
        id: 'acc-5',
        question: 'Apple School Manager 的「管理式 Apple ID」密碼遺失或被鎖定，如何重置？',
        important: false,
        tags: ['Apple ID', '密碼重置'],
        answer: `
**情況一：一般使用者（老師、學生、職員）忘記密碼**
由學校的「管理員」或「人員經理」協助重置：
1.  管理員登入 **[Apple 校務管理 (ASM)](https://school.apple.com/)**。
2.  點選左側 **「使用者 (Users)」** > 搜尋該使用者 > **重置密碼 (Reset Password)**。
3.  系統會生成臨時密碼，請提供給使用者，下次登入時即需更換。

**情況二：管理員 (Administrator) 本人忘記密碼**
請依序嘗試：
1.  **自助重置**：在 ASM 登入頁面點選 **「忘記 Apple ID 或密碼？」**，透過綁定的受信任電話號碼接收驗證碼重置。
2.  **找另一位管理員**：若學校有第二位管理員，請對方登入協助重置您的密碼。
3.  **聯繫 Apple 官方**：若上述皆無效，必須致電 Apple 支援專線 **0800-095-998** (週一至週五 09:00-18:00)，並備妥機構 ID 以供驗證。
        `
      },
      {
        id: 'acc-6',
        question: '如何新增或移除 Apple School Manager 中的管理員帳號？',
        important: false,
        tags: ['ASM', '管理員', '帳號管理'],
        answer: `
**建議**：強烈建議學校隨時保持 **2 位或以上** 的管理員帳號，以免單一人員離職後無法交接。

**新增管理員**：
1.  登入 ASM > **使用者** > **+** 號。
2.  輸入姓名與 **校內 Email**。
3.  角色選擇 **「管理員 (Administrator)」** 並完成建立。

**⚠️ 移除/停用舊管理員前的關鍵檢查**：
**絕對不可刪除** 當初用來建立 **APNs 推播憑證** 的 Apple ID！
*   **檢查方式**：登入 Jamf Pro > **全域管理** > **推播憑證**，查看顯示的 Apple ID。
*   若該 ID 正是您要刪除的人員：**請勿刪除**。請更改其密碼並保留該帳號，供未來每年續約憑證使用。
*   若無關聯，即可在 ASM 使用者列表中點選該員，選擇 **「停用 (Deactivate)」**。
        `
      },
      {
        id: 'acc-7',
        question: '學校的 Jamf Pro 授權數量顯示不足（已超過裝置計數），該如何處理？',
        important: false,
        tags: ['授權', 'License'],
        answer: `
**原因**：
1.  新採購的授權尚未啟用。
2.  已報廢或不再使用的舊裝置仍佔用名額。

**解決方案**：
1.  **清理舊裝置 (釋放授權)**：
    *   先在 ASM 中將舊裝置 **「取消指派 (Unassign)」** MDM。
    *   接著在 Jamf Pro 中搜尋該裝置 > **刪除 (Delete)**。
    *   *注意：必須從 Jamf Pro 刪除紀錄才會真正釋放授權。*
2.  **啟用新授權**：
    *   前往 **設定** > **系統設定** > **啟用代碼 (Activation Code)**。
    *   輸入新的代碼並儲存（或聯繫我們協助處理）。
        `
      },
      {
        id: 'acc-8',
        question: '如何查詢目前學校 Jamf 授權的到期日與剩餘數量？',
        important: false,
        tags: ['授權查詢', '到期日'],
        answer: `
**Jamf Pro**：
*   前往 **設定 (齒輪)** > **系統設定** > **啟用代碼 (Activation Code)**。
*   頁面中會顯示授權總數、已使用數量以及授權到期日。

**Jamf School**：
*   登入後台，點選左下角的 **「Organization」** > **「License」**。
        `
      },
      {
        id: 'acc-9',
        question: '原生 Apple macOS Server (Profile Manager) 停止服務後，舊有裝置該如何遷移至 Jamf？',
        important: false,
        tags: ['macOS Server', '遷移', '重置'],
        answer: `
**背景**：Apple 已於 2022 年終止 macOS Server 的 Profile Manager 功能，舊有伺服器的憑證亦即將失效。

**遷移至 Jamf Pro (雲端 MDM) 步驟**：
1.  **備份資料**：遷移過程需重置裝置，請務必備份。
2.  **ASM 轉移**：
    *   登入 ASM > **裝置** > 搜尋舊裝置序號。
    *   點選 **「編輯 MDM 伺服器」**，將其指派給新的 **Jamf Pro**。
3.  **重置裝置**：
    *   在 iPad 上執行 **「清除所有內容與設定」**。
    *   或是透過 Apple Configurator 連接電腦進行清除。
4.  **重新啟用**：
    *   確認該裝置已加入 Jamf Pro 的 **PreStage 註冊** 範圍。
    *   iPad 重啟連網後，即可自動下載 Jamf 描述檔完成納管。

*若需改為純有線管理 (Apple Configurator)，請參考「裝置註冊」章節的說明。*
        `
      },
      {
        id: 'acc-10',
        question: 'Jamf ID (Jamf Account) 的密碼忘記了，與 Jamf Pro 的登入密碼有何不同？',
        important: false,
        tags: ['Jamf ID', '帳號區別'],
        answer: `
**區別**：
*   **Jamf Pro 帳號**：登入學校 MDM 後台 (如 \`school.jamfcloud.com\`) 用，管理設備。
*   **Jamf ID**：登入 Jamf 官網 (account.jamf.com) 用，管理訂閱、存取 Jamf Nation 論壇。

**解決方案**：
*   若忘記 **Jamf ID**：請前往 [account.jamf.com](https://account.jamf.com) 點選 **「Forgot Password?」**。
*   近期 Jamf 更新密碼政策，若舊密碼失效，請直接執行重置流程。
        `
      },
      {
        id: 'acc-11',
        question: '如何更改 Jamf Pro 控制台的網頁語言（中/英文切換）？',
        important: false,
        tags: ['語言設定', '中文'],
        answer: `
Jamf Pro 完整支援繁體中文介面。

**設定步驟**：
1.  登入 Jamf Pro。
2.  點選右上角的人像圖示（或帳號名稱）。
3.  選擇 **「帳戶偏好設定 (Account Preferences)」**。
4.  在 **「語言 (Language)」** 下拉選單中，選擇 **「Chinese (Traditional) / 繁體中文」**。
5.  點選 **「儲存 (Save)」**，網頁重新整理後即會生效。
        `
      },
      {
        id: 'acc-12',
        question: '遇到 Jamf Cloud 網頁無法開啟或顯示維護中（503 Error）時，該如何確認服務狀態？',
        important: false,
        tags: ['故障排除', '狀態查詢', '503'],
        answer: `
**確認步驟**：
1.  前往 **[Jamf Status Page](https://status.jamf.com/)**。
2.  查看是否有公告 **"Cloud Maintenance" (維護中)** 或 **"Service Interruption" (服務中斷)**。
3.  若狀態顯示正常 (All Systems Operational) 但仍無法登入：
    *   嘗試清除瀏覽器快取 (Cookie/Cache) 或使用無痕視窗。
    *   檢查學校防火牆是否阻擋了 Jamf 的網域。
    *   若問題持續，請截圖錯誤畫面聯繫客服。
        `
      }
    ]
  }
]

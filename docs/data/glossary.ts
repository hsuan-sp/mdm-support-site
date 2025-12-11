/**
 * 維護指南：
 * 1. 若要新增術語，請直接複製下方的 {...}區塊並貼在對應分類中。
 * 2. 修改存檔後，下次啟動 (npm run docs:dev) 會自動更新搜尋索引。
 */
export interface Term {
  term: string;
  category: 'Core' | 'Enrollment' | 'Apple' | 'Network' | 'Security' | 'Hardware' | 'Apps' | 'Other' | 'Education';
  definition: string;
  analogy: string; // "白話文/比喻"
}

export const glossaryData: Term[] = [
  // --- A ---
  {
    term: 'AAS (Automatic Assessment Configuration)',
    category: 'Education',
    definition: '自動評量設定。一種用於鎖定 iPad 進行標準化測驗的框架，App 可自動觸發單一 App 模式並阻擋字典、拼字檢查等功能。',
    analogy: '「考場模式」。考試鐘聲一響，自動把課本收起來，只准留原子筆和橡皮擦。'
  },
  {
    term: 'ABM (Apple Business Manager)',
    category: 'Apple',
    definition: 'Apple 商務管理。專為企業設計的網頁入口，集成了裝置註冊 (ADE)、內容購買 (VPP)、與角色管理。',
    analogy: '企業的「數位總部」。註冊公司裝置、買 App、分派管理員權限都在這裡完成。'
  },
  {
    term: 'Account-Driven User Enrollment',
    category: 'Enrollment',
    definition: '基於帳號的使用者註冊。使用者只需在「設定」中登入管理式 Apple ID，即可啟動 BYOD 註冊流程，無需掃描 QR Code。',
    analogy: '「登入即報到」。不用填表單，刷了員工證（登入帳號）就自動完成入職手續。'
  },
  {
    term: 'Activation Lock (啟用鎖定)',
    category: 'Security',
    definition: '防盜功能，與「尋找」連動。裝置重置後需輸入原 Apple ID 密碼才能啟用。MDM 可透過 Bypass Code 繞過。',
    analogy: '防小偷的「數位大鎖」。就算偷走重灌，沒有原主人的密碼也打不開，變磚頭一塊。'
  },
  {
    term: 'Activation Lock Bypass Code',
    category: 'Security',
    definition: '啟用鎖定略過代碼。MDM 自動擷取的一組英數代碼，可代替 Apple ID 密碼來解鎖被鎖定的受管裝置。',
    analogy: '「萬能鑰匙」。員工離職沒交出密碼，公司可以用這把備用鑰匙把鎖打開。'
  },
  {
    term: 'ACME (Automated Certificate Management Environment)',
    category: 'Security',
    definition: '自動憑證管理環境。一種自動化申請與更新數位憑證的通訊協定。',
    analogy: '憑證的「自動販賣機」。需要證件時不用人工審核，投幣自動發放。'
  },
  {
    term: 'ADE (Automated Device Enrollment)',
    category: 'Enrollment',
    definition: '自動裝置註冊（舊稱 DEP）。讓新裝置開機連網後，自動向 MDM 報到並下載設定，實現零接觸部署。',
    analogy: '「入學報到單」。一開機，Apple 就告訴它：「你是學校的財產，請去跟資訊組報到」。'
  },
  {
    term: 'Admin Account (管理者帳號)',
    category: 'Security',
    definition: '擁有最高系統權限的使用者帳號，可安裝軟體、修改所有設定。在受管裝置上通常由 IT 控管。',
    analogy: '「房東」。有權拆牆壁、換鎖、把房客趕出去。'
  },
  {
    term: 'AirDrop',
    category: 'Core',
    definition: 'Apple 裝置間的無線傳輸技術，利用藍牙搜尋與 Wi-Fi 點對點傳輸。',
    analogy: '數位「傳紙條」。不需網路，手機對手機直接丟檔案，速度快。'
  },
  {
    term: 'AirDrop for Business',
    category: 'Security',
    definition: '管理功能。允許 MDM 限制 AirDrop 僅能在管理式 Apple ID 或特定聯絡人間使用，防止機密外洩。',
    analogy: '「公務傳送」。規定上班時間傳紙條只能傳給同事，不能傳給路人。'
  },
  {
    term: 'AirPlay',
    category: 'Core',
    definition: '無線串流技術。將畫面或音訊鏡像輸出至 Apple TV 或支援的螢幕。',
    analogy: '無線「投影線」。'
  },
  {
    term: 'AirPrint',
    category: 'Core',
    definition: '免驅動程式列印技術。Apple 裝置可直接搜尋並列印至支援 AirPrint 的印表機。',
    analogy: '「通用列印」。不用裝驅動程式，手機看到印表機就能直接印。'
  },
  {
    term: 'Always-on VPN',
    category: 'Network',
    definition: '全時 VPN。強制裝置只要有網路，就必須建立 VPN 連線，確保所有流量都經過加密通道。',
    analogy: '「專車接送」。不管你去哪，一定要坐公司的防彈專車，不能自己走路或搭公車。'
  },
  {
    term: 'APNs (Apple Push Notification service)',
    category: 'Apple',
    definition: 'Apple 推播服務。MDM 與裝置通訊的橋樑，用於喚醒裝置以接收指令。',
    analogy: 'MDM 的「傳令兵」。MDM 不能直接對平板大叫，要靠 Apple 幫忙傳話。'
  },
  {
    term: 'App Config (App Configuration)',
    category: 'Apps',
    definition: 'App 設定配置。MDM 可在安裝 App 時一併派送 XML 設定檔，預先填好伺服器網址或使用者資訊。',
    analogy: '「預填表單」。發給你的 App 已經幫你填好伺服器地址，不用自己手動輸入。'
  },
  {
    term: 'App Store',
    category: 'Apps',
    definition: 'Apple 的官方應用程式商店。受監管裝置可被限制無法自行開啟或下載。',
    analogy: '「百貨公司」。'
  },
  {
    term: 'Apple Classroom (Apple 課堂)',
    category: 'Education',
    definition: '教師專用 App。可監看學生畫面、鎖定 iPad、導引開啟特定 App。需藍牙與同網段 Wi-Fi。',
    analogy: '「隨堂助教」。老師在講台上一鍵控制全班平板，還能偷看誰在玩遊戲。'
  },
  {
    term: 'Apple Configurator',
    category: 'Core',
    definition: 'Mac 應用程式。用於手動透過 USB 連接來修復、更新、或將裝置加入 ABM/ASM (分派)。',
    analogy: '「重裝工廠」。平板有大問題或要手動納管時，接上線進廠維修。'
  },
  {
    term: 'Apple ID',
    category: 'Apple',
    definition: 'Apple 生態系的個人帳戶。',
    analogy: 'Apple 世界的「身分證」。'
  },
  {
    term: 'Apple Silicon',
    category: 'Hardware',
    definition: 'Apple 自研晶片 (M1/M2/M3...)。具備高效能與特殊管理架構 (如利用 Volume Owner 管理更新)。',
    analogy: '「蘋果引擎」。'
  },
  {
    term: 'ARD (Apple Remote Desktop)',
    category: 'Core',
    definition: 'Apple 的高階遠端管理軟體。可進行大規模畫面監控、檔案派送與 UNIX 指令執行。',
    analogy: '「千里眼」。管理者坐在辦公室就能看到並控制整棟樓的 Mac。'
  },
  {
    term: 'ASM (Apple School Manager)',
    category: 'Apple',
    definition: 'Apple 校務管理。教育機構專用的 web portal，整合 SIS、裝置指派與內容購買。',
    analogy: '學校的「數位教務處」。'
  },
  {
    term: 'Asset Tag (資產標籤)',
    category: 'Core',
    definition: '組織自訂的設備編號，可寫入裝置資訊並顯示於鎖定畫面。',
    analogy: '「財產編號」。'
  },
  {
    term: 'Assessment Mode (評量模式)',
    category: 'Education',
    definition: '一種限制模式，與單一 App 模式類似，但專注於考試安全。',
    analogy: '「監考模式」。'
  },
  {
    term: 'Assignment (指派)',
    category: 'Enrollment',
    definition: '在 ABM/ASM 中將裝置「指派」給特定 MDM 伺服器的動作。',
    analogy: '「分發」。這批新兵（平板）分發給哪個連隊（MDM）管理。'
  },
  // --- B ---
  {
    term: 'B2B App (Custom App)',
    category: 'Apps',
    definition: '客製化 App。由開發者透過 ABM 私有發布給特定企業的 App，不上架公開 App Store。',
    analogy: '「隱藏菜單」。只有內部員工才點得到的特製餐點。'
  },
  {
    term: 'Backup (備份)',
    category: 'Core',
    definition: '將裝置資料透過 iCloud 或電腦進行備份。受管裝置通常會限制備份以防資料外洩。',
    analogy: '「副本」。'
  },
  {
    term: 'Beta Profile',
    category: 'Core',
    definition: '測試版描述檔。安裝後可讓裝置接收 iOS Beta 測試版更新。生產環境應禁止。',
    analogy: '「白老鼠證」。持有這張證就可以去試吃還沒上市的新菜（不保證不會拉肚子）。'
  },
  {
    term: 'Blueprint (藍圖)',
    category: 'Enrollment',
    definition: 'Configurator 的樣板功能，包含一組 App 與設定檔，可一鍵套用。',
    analogy: '「設定模具」。'
  },
  {
    term: 'Bluetooth',
    category: 'Hardware',
    definition: '短距離無線通訊技術。Apple 課堂與 AirDrop 的基礎。',
    analogy: '「藍牙」。'
  },
  {
    term: 'Bonjour',
    category: 'Network',
    definition: 'Apple 的零設定網路探索協定 (mDNS)。用於尋找區網內的 AirPlay/AirPrint 服務。',
    analogy: '「廣播尋人」。大喊「誰是印表機？」，印表機聽到就會舉手回應。'
  },
  {
    term: 'Bootstrap Token',
    category: 'Security',
    definition: 'macOS 引導代幣。賦予 MDM 管理 Secure Token 的權限，讓 MDM 能授權新使用者或安裝更新。',
    analogy: '「授權信物」。MDM 擁有這個信物，才能指揮加密晶片做高權限動作。'
  },
  {
    term: 'Brick (磚塊/死機)',
    category: 'Hardware',
    definition: '裝置因軟體損壞無法開機。',
    analogy: '「高科技紙鎮」。'
  },
  {
    term: 'Bundle ID',
    category: 'Apps',
    definition: 'App 的唯一識別碼 (如 com.apple.safari)。',
    analogy: 'App的「身分證號」。'
  },
  {
    term: 'BYOD (Bring Your Own Device)',
    category: 'Enrollment',
    definition: '自攜裝置。員工使用私人設備辦公，透過「使用者註冊」保護隱私。',
    analogy: '「自備工具」。'
  },
  // --- C ---
  {
    term: 'Cache (快取)',
    category: 'Core',
    definition: 'Content Caching。暫存 iCloud/App Store 內容以加速下載。',
    analogy: '「糧倉」。'
  },
  {
    term: 'Captive Portal',
    category: 'Network',
    definition: '強制登入頁面。連上 Wi-Fi 後跳出的網頁認證畫面。MDM 部署通常應避開此類網路以免中斷。',
    analogy: '「連線路障」。要上網前得先看廣告或輸入帳密，機器人（MDM）通常會被卡住過不去。'
  },
  {
    term: 'Cellular',
    category: 'Hardware',
    definition: '行動網路版 iPad。',
    analogy: '「插卡版」。'
  },
  {
    term: 'Certificate (憑證)',
    category: 'Security',
    definition: '數位身分證明，用於 Wi-Fi 認證、SSL 加密與 MDM 信任。',
    analogy: '「數位印鑑證明」。'
  },
  {
    term: 'ClassKit',
    category: 'Education',
    definition: 'Apple 開發框架。讓教育 App 能與「一般作業 (Schoolwork)」App 整合，回報學生進度。',
    analogy: '「成績回報介面」。'
  },
  {
    term: 'Command (指令)',
    category: 'Core',
    definition: 'MDM 發送給裝置的單一動作要求，如「鎖定」、「清除密碼」、「安裝 App」。',
    analogy: '「命令」。'
  },
  {
    term: 'Configuration Profile',
    category: 'Core',
    definition: '設定描述檔 (.mobileconfig)。',
    analogy: '「錦囊妙計」。'
  },
  {
    term: 'Console (控制台)',
    category: 'Core',
    definition: 'macOS 系統記錄檢視器，或 MDM 的網頁管理介面。',
    analogy: '「儀表板」。'
  },
  {
    term: 'Container (容器)',
    category: 'Security',
    definition: '資料隔離區。BYOD 模式下，企業資料與個人資料被分開儲存在不同容器中互不相通。',
    analogy: '「便當盒的分隔」。飯是飯，菜是菜，混不在一起。'
  },
  {
    term: 'Content Caching (內容快取)',
    category: 'Network',
    definition: 'macOS 功能。將 Mac 變成快取伺服器，加速區網內其他 Apple 裝置的更新下載。',
    analogy: '「區域分發中心」。'
  },
  {
    term: 'Content Filter (內容過濾)',
    category: 'Security',
    definition: '限制瀏覽特定網站的功能。iPadOS 17+ 使用 DNS/Socket 過濾技術。',
    analogy: '「網路守門員」。'
  },
  {
    term: 'CSR (Certificate Signing Request)',
    category: 'Security',
    definition: '憑證簽署請求。',
    analogy: '「辦證申請書」。'
  },
  // --- D ---
  {
    term: 'Declarative Management (宣告式管理)',
    category: 'Core',
    definition: '新一代 MDM 協定。裝置主動判定是否符合條件並套用設定，減輕伺服器負擔並提高反應速度。',
    analogy: '「自動駕駛」。不用伺服器一步步教，給裝置規則書，它自己會看狀況應變。'
  },
  {
    term: 'Deferral (延遲更新)',
    category: 'Core',
    definition: '延遲 OS 更新可見天數（最多90天）。',
    analogy: '「新版遮蔽眼罩」。戴上後90天內看不到有更新通知。'
  },
  {
    term: 'DEP (Device Enrollment Program)',
    category: 'Enrollment',
    definition: 'ADE 的舊稱。',
    analogy: '「舊版自動註冊」。'
  },
  {
    term: 'Device (裝置)',
    category: 'Core',
    definition: '指 iPad, iPhone, Mac, Apple TV 等受管設備。',
    analogy: '「設備」。'
  },
  {
    term: 'Device Group (裝置群組)',
    category: 'Core',
    definition: '將裝置分類以便管理的集合。',
    analogy: '「班級/分組」。'
  },
  {
    term: 'Device Name (裝置名稱)',
    category: 'Core',
    definition: '裝置在網路與 AirDrop 上顯示的名字。MDM 可強制變更。',
    analogy: '「名牌」。'
  },
  {
    term: 'DFU Mode',
    category: 'Hardware',
    definition: '裝置韌體更新模式。最底層的救援模式。',
    analogy: '「加護病房」。'
  },
  {
    term: 'Directory Service (目錄服務)',
    category: 'Network',
    definition: '如 LDAP / Active Directory。儲存使用者與群組資料的資料庫。',
    analogy: '「戶政名冊」。'
  },
  {
    term: 'DNS Proxy',
    category: 'Network',
    definition: 'Jamf Trust 在 iPadOS 17+ 使用的過濾技術，攔截 DNS 查詢以阻擋惡意網站。',
    analogy: '「網址過濾員」。你想去哪，先問他地址對不對，壞地址直接不告訴你路。'
  },
  {
    term: 'Dock',
    category: 'Core',
    definition: '畫面下方的工具列。MDM 可固定特定的 App 在 Dock 上。',
    analogy: '「工具腰帶」。最常用的工具掛在腰上隨手可得。'
  },
  {
    term: 'Dongle (轉接器)',
    category: 'Hardware',
    definition: '介面轉換器。',
    analogy: '「翻譯蒟蒻」。'
  },
  // --- E ---
  {
    term: 'Enterprise App',
    category: 'Apps',
    definition: '企業內部 App。透過企業開發者憑證簽署，繞過 App Store 直接安裝。',
    analogy: '「私房菜」。'
  },
  {
    term: 'Enrollment (註冊)',
    category: 'Enrollment',
    definition: '將裝置納入 MDM 管理的過程。',
    analogy: '「入籍」。'
  },
  {
    term: 'eSIM',
    category: 'Hardware',
    definition: '嵌入式 SIM 卡。',
    analogy: '「數位門號」。'
  },
  {
    term: 'Extension Attribute (擴充屬性)',
    category: 'Core',
    definition: 'Jamf Pro 功能。利用 Script 收集裝置的客製化資訊（如：剩餘磁碟空間、特定檔案是否存在）。',
    analogy: '「客製化問卷」。MDM 預設只問身高體重，用這個可以多問「你有沒有吃早餐」。'
  },
  // --- F ---
  {
    term: 'FaceID',
    category: 'Hardware',
    definition: '臉部識別技術。MDM 可限制是否允許使用。',
    analogy: '「刷臉」。'
  },
  {
    term: 'Factory Reset (恢復原廠)',
    category: 'Core',
    definition: '清除所有內容與設定。',
    analogy: '「洗白」。'
  },
  {
    term: 'Federated Authentication (聯合驗證)',
    category: 'Apple',
    definition: '連結 ABM 與 Google/Azure AD，讓員工用公司原本帳號登入 Apple ID。',
    analogy: '「帳號通」。'
  },
  {
    term: 'FileVault',
    category: 'Security',
    definition: 'macOS 全磁碟加密。',
    analogy: '「保險箱」。'
  },
  {
    term: 'Firmware Password',
    category: 'Security',
    definition: '韌體密碼 (Intel Mac)。防止從外接硬碟開機。在 Apple Silicon 被 Recovery Lock 取代。',
    analogy: '「BIOS 密碼」。'
  },
  {
    term: 'Force Restart',
    category: 'Hardware',
    definition: '強制重開機。',
    analogy: '「拔插頭」。'
  },
  // --- G ---
  {
    term: 'Gatekeeper',
    category: 'Security',
    definition: 'macOS 安全機制。阻擋未簽署或惡意的軟體執行。',
    analogy: '「警衛」。只放行有識別證（簽署）的人進來。'
  },
  {
    term: 'Ghost Touch',
    category: 'Hardware',
    definition: '螢幕亂跳。',
    analogy: '「鬼影觸控」。'
  },
  {
    term: 'Global Proxy',
    category: 'Network',
    definition: '全域代理。所有流量強制經過 Proxy。',
    analogy: '「唯一關口」。'
  },
  {
    term: 'Guest Mode (訪客模式)',
    category: 'Education',
    definition: '共用 iPad 的免帳號登入模式，登出不存檔。',
    analogy: '「無痕模式」。'
  },
  {
    term: 'Guided Access (引導使用模式)',
    category: 'Core',
    definition: 'iOS 輔助使用功能。暫時鎖定在單一 App，可由使用者在本機開啟，非 MDM 強制。',
    analogy: '「簡易版鎖定」。手動把小孩關在畫畫 App 裡不讓他亂按。'
  },
  // --- H ---
  {
    term: 'Handoff',
    category: 'Core',
    definition: '接力功能。在 Mac 上繼續編輯 iPad 寫到一半的郵件。',
    analogy: '「接力跑」。'
  },
  {
    term: 'HDMI',
    category: 'Hardware',
    definition: '影音傳輸介面。',
    analogy: '「電視線」。'
  },
  {
    term: 'HEIC',
    category: 'Core',
    definition: '高效率圖檔格式。Apple 預設相片格式，比 JPG 更小更清晰。',
    analogy: '「壓縮圖檔」。'
  },
  {
    term: 'Home Screen Layout',
    category: 'Core',
    definition: '主畫面佈局。MDM 可定義 App 排列與資料夾。',
    analogy: '「座位表」。規定誰（App）要坐在哪裡。'
  },
  {
    term: 'Hotspot (熱點)',
    category: 'Network',
    definition: '個人熱點。',
    analogy: '「分享網路」。'
  },
  // --- I ---
  {
    term: 'iCloud Backup',
    category: 'Core',
    definition: '雲端備份。MDM 可禁止受管裝置備份到個人 iCloud。',
    analogy: '「雲端硬碟」。'
  },
  {
    term: 'Identity Provider (IdP)',
    category: 'Security',
    definition: '身分認證提供者 (如 Azure AD, Okta)。',
    analogy: '「發證中心」。'
  },
  {
    term: 'IMEI',
    category: 'Hardware',
    definition: '行動裝置的國際識別碼 (身分證)，插卡版 iPad 才有。',
    analogy: '「手機身分證」。'
  },
  {
    term: 'Inspection (巡檢)',
    category: 'Education',
    definition: '定期檢查設備狀態的程序。',
    analogy: '「裝備檢查」。'
  },
  {
    term: 'Install Later',
    category: 'Core',
    definition: 'MDM 更新策略。先下載更新，等待夜間或使用者同意後再安裝。',
    analogy: '「稍後安裝」。'
  },
  {
    term: 'Inventory (資產清單)',
    category: 'Core',
    definition: 'MDM 收集的裝置詳細資訊列表。',
    analogy: '「財產清冊」。'
  },
  {
    term: 'IPA',
    category: 'Apps',
    definition: 'iOS App 安裝檔格式 (.ipa)。',
    analogy: '「安裝包」。'
  },
  {
    term: 'IPSW',
    category: 'Core',
    definition: 'iOS/iPadOS 韌體映像檔 (.ipsw)。用於重刷系統。',
    analogy: '「系統光碟」。'
  },
  // --- J ---
  {
    term: 'Jamf Connect',
    category: 'Security',
    definition: 'Jamf 產品。用於同步 Mac 本機帳戶與雲端 IdP (Google/Azure) 密碼。',
    analogy: '「雲端登入外掛」。'
  },
  {
    term: 'Jamf Helper',
    category: 'Core',
    definition: 'macOS 工具。可在螢幕上跳出自訂的全螢幕訊息或視窗，常用於更新通知。',
    analogy: '「全螢幕廣播」。'
  },
  {
    term: 'Jamf Pro',
    category: 'Core',
    definition: '企業級與教育級 MDM 解決方案。',
    analogy: '「旗艦版管家」。'
  },
  {
    term: 'Jamf Protect',
    category: 'Security',
    definition: 'Mac 專用的端點防護系統 (防毒/EDR)。',
    analogy: '「Mac 防毒軟體」。'
  },
  {
    term: 'Jamf Remote',
    category: 'Core',
    definition: 'Jamf 舊版遠端管理工具。',
    analogy: '「遠端遙控器」。'
  },
  {
    term: 'Jamf School',
    category: 'Education',
    definition: '專為教育設計的 MDM (原 ZuluDesk)，介面較簡單。',
    analogy: '「校園版管家」。'
  },
  {
    term: 'Jamf Teacher',
    category: 'Education',
    definition: '該 MDM 提供的教師用 App，可限制網站、App 與功能。不需藍牙。',
    analogy: '「雲端糾察隊」。'
  },
  {
    term: 'Jamf Trust',
    category: 'Apps',
    definition: '安全性 App。提供內容過濾與數據回報。',
    analogy: '「數位通行證」。'
  },
  {
    term: 'JSS (Jamf Software Server)',
    category: 'Core',
    definition: 'Jamf Pro 伺服器的舊稱。',
    analogy: '「主機」。'
  },
  // --- K ---
  {
    term: 'Kerberos',
    category: 'Security',
    definition: '網路認證協定。用於單一登入 (SSO) 內網資源。',
    analogy: '「通關票券」。'
  },
  {
    term: 'Kernel Extension (kext)',
    category: 'Core',
    definition: '核心擴充功能 (驅動)。macOS 正逐步淘汰，改用 System Extension。',
    analogy: '「系統外掛」。'
  },
  {
    term: 'Keychain (鑰匙圈)',
    category: 'Security',
    definition: 'macOS/iOS 儲存密碼與憑證的加密資料庫。',
    analogy: '「密碼本」。'
  },
  {
    term: 'Kiosk Mode',
    category: 'Apps',
    definition: '單一 App 模式。',
    analogy: '「導覽機」。'
  },
  // --- L ---
  {
    term: 'LAPS (Local Admin Password Solution)',
    category: 'Security',
    definition: '本機管理員密碼解決方案。自動定期更換管理員密碼。',
    analogy: '「自動換鎖」。每天自動換門鎖密碼，就算今天被偷看，明天也沒用了。'
  },
  {
    term: 'LDAP',
    category: 'Network',
    definition: '輕量目錄存取協定。用於查詢使用者帳號。',
    analogy: '「查號台」。'
  },
  {
    term: 'Lightning',
    category: 'Hardware',
    definition: 'Apple 舊款 8-pin 接頭。',
    analogy: '「蘋果頭」。'
  },
  {
    term: 'Local Admin (本機管理員)',
    category: 'Security',
    definition: '儲存在電腦本機的管理者帳號。',
    analogy: '「房東」。'
  },
  {
    term: 'Location Services (定位服務)',
    category: 'Core',
    definition: 'GPS/Wi-Fi 定位。MDM 啟用「遺失模式」時可強制開啟。',
    analogy: '「定位」。'
  },
  {
    term: 'Lock Message',
    category: 'Security',
    definition: '鎖定畫面訊息。MDM 可在螢幕鎖定時顯示資產編號或聯絡資訊。',
    analogy: '「失物招領貼紙」。'
  },
  {
    term: 'Lost Mode (遺失模式)',
    category: 'Security',
    definition: '鎖定遺失裝置並追蹤位置。',
    analogy: '「緊急封鎖」。'
  },
  // --- M ---
  {
    term: 'MAC Address',
    category: 'Network',
    definition: '硬體網卡位址。',
    analogy: '「網卡身分證」。'
  },
  {
    term: 'Managed App (受管 App)',
    category: 'Apps',
    definition: '由 MDM 安裝並管理的 App。MDM 可隨時移除並備份資料。',
    analogy: '「公發軟體」。'
  },
  {
    term: 'Managed Apple ID (管理式 Apple ID)',
    category: 'Apple',
    definition: '組織建立的 Apple ID，用於教育或商務，功能受限。',
    analogy: '「公務帳號」。'
  },
  {
    term: 'Managed Distribution',
    category: 'Apps',
    definition: '管理式分發。VPP 的授權分派機制。',
    analogy: '「派送」。'
  },
  {
    term: 'Managed Open In',
    category: 'Security',
    definition: '資料流向限制。禁止將受管 App (如 Mail) 的附件用非受管 App (如個人 Line) 開啟。',
    analogy: '「公文不落地」。公家的文件只能用公家的軟體開，不能傳到私人信箱。'
  },
  {
    term: 'MDM (Mobile Device Management)',
    category: 'Core',
    definition: '行動裝置管理。',
    analogy: '「遙控總管」。'
  },
  {
    term: 'mDNS',
    category: 'Network',
    definition: 'Multicast DNS (Bonjour)。',
    analogy: '「區網廣播」。'
  },
  {
    term: 'Mobile Config',
    category: 'Core',
    definition: '描述檔副檔名 (.mobileconfig)。',
    analogy: '「設定檔」。'
  },
  // --- N ---
  {
    term: 'N-1 Strategy',
    category: 'Core',
    definition: '更新策略。保持在最新版本的前一個版本，以確保穩定性。',
    analogy: '「老二哲學」。不搶頭香，等別人試過沒問題再更新。'
  },
  {
    term: 'Network Usage',
    category: 'Network',
    definition: '網路使用量。精進方案重點監測數據。',
    analogy: '「流量」。'
  },
  {
    term: 'Night Shift',
    category: 'Hardware',
    definition: '夜覽模式。濾藍光。',
    analogy: '「護眼模式」。'
  },
  {
    term: 'Notarization (公證)',
    category: 'Security',
    definition: 'Apple 掃描並驗證 macOS 軟體無惡意程式的過程。',
    analogy: '「良民證」。Apple 蓋章確認這個軟體沒毒。'
  },
  {
    term: 'Notification',
    category: 'Core',
    definition: '通知。MDM 可透過 APNs 發送通知至裝置。',
    analogy: '「推播」。'
  },
  // --- O ---
  {
    term: 'Offline (離線)',
    category: 'Network',
    definition: '裝置未連接網路或無法聯繫 MDM。',
    analogy: '「失聯」。'
  },
  {
    term: 'OIDC',
    category: 'Security',
    definition: 'OpenID Connect。現代化身分認證協定 (Jamf Connect 使用)。',
    analogy: '「通用登入」。'
  },
  {
    term: 'Organization Key',
    category: 'Security',
    definition: 'FileVault 的機構復原金鑰。所有電腦共用一把（舊式作法，不推薦）。',
    analogy: '「萬用備份鑰匙」。'
  },
  {
    term: 'OS Update',
    category: 'Core',
    definition: '作業系統更新。MDM 可強制、延遲或排程更新。',
    analogy: '「系統升級」。'
  },
  {
    term: 'OTA (Over-The-Air)',
    category: 'Core',
    definition: '空中傳輸 (免接線)。',
    analogy: '「無線」。'
  },
  // --- P ---
  {
    term: 'PAC File',
    category: 'Network',
    definition: 'Proxy Auto-Config。自動代理設定檔。',
    analogy: '「導航設定檔」。告訴電腦哪些網站要走代理，哪些不用。'
  },
  {
    term: 'Package (PKG)',
    category: 'Core',
    definition: 'macOS 安裝套件檔。',
    analogy: '「安裝包」。'
  },
  {
    term: 'Passcode Policy',
    category: 'Security',
    definition: '密碼原則 (長度、複雜度)。',
    analogy: '「密碼規定」。'
  },
  {
    term: 'Payload',
    category: 'Core',
    definition: '描述檔中的單一設定項目 (如 Wi-Fi Payload)。',
    analogy: '「設定條目」。'
  },
  {
    term: 'Pending Command',
    category: 'Core',
    definition: '擱置指令。已發出但尚未執行的指令。',
    analogy: '「未讀命令」。'
  },
  {
    term: 'Per-App VPN',
    category: 'Network',
    definition: '單一 App VPN。只有開啟特定 App 時才建立 VPN 連線。',
    analogy: '「App 專用通道」。開公文系統才連回公司，看 YouTube 就走一般網路。'
  },
  {
    term: 'Personal Recovery Key (PRK)',
    category: 'Security',
    definition: '個人復原金鑰。FileVault 為每台電腦生成的獨特解鎖金鑰。',
    analogy: '「專屬備用鑰匙」。'
  },
  {
    term: 'Platform SSO',
    category: 'Security',
    definition: 'macOS 13+ 新功能。在系統層級整合雲端身分 (IdP)，取代傳統綁定 AD。',
    analogy: '「新版帳號整合」。'
  },
  {
    term: 'Plist',
    category: 'Core',
    definition: 'Property List。macOS/iOS 的設定檔格式 (XML/Binary)。',
    analogy: '「參數檔」。'
  },
  {
    term: 'Policy (原則)',
    category: 'Core',
    definition: 'Jamf Pro (macOS) 的執行邏輯單元，包含 Trigger, Scope, Payload。',
    analogy: '「任務包」。規定何時、對誰、做什麼事。'
  },
  {
    term: 'PPD',
    category: 'Core',
    definition: 'PostScript Printer Description。印表機描述檔。',
    analogy: '「印表機身分證」。'
  },
  {
    term: 'PreStage Enrollment',
    category: 'Enrollment',
    definition: '定義 ADE 裝置在開機設定助理階段的行為。',
    analogy: '「入學關卡設定」。'
  },
  {
    term: 'Private Wi-Fi Address',
    category: 'Network',
    definition: '私有 Wi-Fi 位址 (隨機 MAC)。',
    analogy: '「網卡假名」。'
  },
  {
    term: 'Profile (描述檔)',
    category: 'Core',
    definition: 'Configuration Profile。',
    analogy: '「設定錦囊」。'
  },
  {
    term: 'Provisioning',
    category: 'Core',
    definition: '佈建。新機準備流程。',
    analogy: '「新機整備」。'
  },
  {
    term: 'Proxy',
    category: 'Network',
    definition: '代理伺服器。',
    analogy: '「中轉站」。'
  },
  {
    term: 'Push Notification',
    category: 'Core',
    definition: '推播通知。',
    analogy: '「通知」。'
  },
  // --- R ---
  {
    term: 'Rapid Security Response',
    category: 'Security',
    definition: '快速安全回應。小型更新，不需重開機即可修補漏洞。',
    analogy: '「熱修補」。'
  },
  {
    term: 'Recovery Key',
    category: 'Security',
    definition: '復原金鑰。',
    analogy: '「備用鑰匙」。'
  },
  {
    term: 'Recovery Lock',
    category: 'Security',
    definition: '復原鎖 (Apple Silicon)。防止未經授權進入 Recovery 模式。',
    analogy: '「急診室門鎖」。沒密碼不能隨便把電腦重灌。'
  },
  {
    term: 'Recovery Mode',
    category: 'Hardware',
    definition: '復原模式。',
    analogy: '「急診室」。'
  },
  {
    term: 'Remote Management',
    category: 'Core',
    definition: '遠端管理。',
    analogy: '「遠端控制」。'
  },
  {
    term: 'Remote Wipe',
    category: 'Security',
    definition: '遠端清除。',
    analogy: '「遠端毀滅」。'
  },
  {
    term: 'Renew Certificate',
    category: 'Security',
    definition: '更新憑證。',
    analogy: '「換證」。'
  },
  {
    term: 'Restrictions',
    category: 'Core',
    definition: '限制。禁止相機、App Store 等功能。',
    analogy: '「校規」。'
  },
  {
    term: 'Return to Service',
    category: 'Enrollment',
    definition: '重置後自動連回 Wi-Fi 並重新註冊。',
    analogy: '「轉生保留記憶」。死掉重來（重置）但還記得路，馬上跑回來報到。'
  },
  {
    term: 'Roaming',
    category: 'Network',
    definition: '漫遊。',
    analogy: '「基地台切換」。'
  },
  {
    term: 'Roster',
    category: 'Education',
    definition: '花名冊。匯入 ASM 的師生與班級資料。',
    analogy: '「點名簿」。'
  },
  // --- S ---
  {
    term: 'Safe Mode',
    category: 'Hardware',
    definition: '安全模式。僅載入核心驅動，用於除錯。',
    analogy: '「除錯模式」。'
  },
  {
    term: 'SAML',
    category: 'Security',
    definition: '安全宣告標記語言。SSO 交換身分資訊的標準。',
    analogy: '「數位通行證格式」。'
  },
  {
    term: 'SCEP',
    category: 'Security',
    definition: '簡易憑證註冊協定。',
    analogy: '「自動辦證通道」。'
  },
  {
    term: 'Schoolwork (一般作業)',
    category: 'Education',
    definition: 'Apple 的作業指派 App。',
    analogy: '「電子聯絡簿」。'
  },
  {
    term: 'Scope (範圍)',
    category: 'Core',
    definition: '指派 MDM 設定的對象範圍 (Target + Limitations + Exclusions)。',
    analogy: '「發放名單」。這份作業發給誰、不發給誰。'
  },
  {
    term: 'Screen Time',
    category: 'Core',
    definition: '螢幕使用時間。',
    analogy: '「使用統計」。'
  },
  {
    term: 'Script',
    category: 'Core',
    definition: '腳本 (Bash/Python)。',
    analogy: '「劇本/指令集」。'
  },
  {
    term: 'Secure Token',
    category: 'Security',
    definition: 'macOS 安全代幣。授予使用者啟用 FileVault 的權限。',
    analogy: '「加密權限」。'
  },
  {
    term: 'Self Service',
    category: 'Apps',
    definition: '自助服務 App。企業/學校的內部 App Store。',
    analogy: '「福利社」。'
  },
  {
    term: 'Serial Number',
    category: 'Hardware',
    definition: '序號。',
    analogy: '「產品身分證」。'
  },
  {
    term: 'Shared iPad',
    category: 'Education',
    definition: '共享 iPad。多使用者登入。',
    analogy: '「公用電腦」。'
  },
  {
    term: 'Sideloading',
    category: 'Apps',
    definition: '側載。不經 App Store 安裝 App。',
    analogy: '「走後門安裝」。'
  },
  {
    term: 'Single App Mode',
    category: 'Apps',
    definition: '單一 App 模式。',
    analogy: '「鎖定模式」。'
  },
  {
    term: 'SIP (System Integrity Protection)',
    category: 'Security',
    definition: '系統完整性保護。防止 root 修改核心系統檔。',
    analogy: '「防彈玻璃」。'
  },
  {
    term: 'Site',
    category: 'Core',
    definition: 'Jamf Pro 的分站功能。將不同校區的管理權限分開。',
    analogy: '「分校」。'
  },
  {
    term: 'Smart Group',
    category: 'Core',
    definition: '智慧型群組。依條件動態分類。',
    analogy: '「自動分類帽」。'
  },
  {
    term: 'Software Update',
    category: 'Core',
    definition: '軟體更新。',
    analogy: '「更新」。'
  },
  {
    term: 'SSID',
    category: 'Network',
    definition: 'Wi-Fi 名稱。',
    analogy: '「無線網路名」。'
  },
  {
    term: 'SSL (Secure Sockets Layer)',
    category: 'Security',
    definition: '加密傳輸協定 (現多指 TLS)。',
    analogy: '「加密通道」。'
  },
  {
    term: 'SSO (Single Sign-On)',
    category: 'Security',
    definition: '單一登入。登入一次即可存取多個服務。',
    analogy: '「一證通」。刷一次卡，門禁、電梯、餐廳都能用。'
  },
  {
    term: 'Static Group',
    category: 'Core',
    definition: '靜態群組。手動建立的名單。',
    analogy: '「固定名冊」。'
  },
  {
    term: 'Supervision (受監管)',
    category: 'Core',
    definition: '最高管理權限模式。',
    analogy: '「完全託管」。'
  },
  {
    term: 'System Extension',
    category: 'Core',
    definition: '系統擴充功能。新一代驅動程式架構，比 kext 安全。',
    analogy: '「安全外掛」。'
  },
  // --- T ---
  {
    term: 'Target Disk Mode',
    category: 'Hardware',
    definition: '目標磁碟模式。將 Mac 變成外接硬碟 (Intel Mac)。',
    analogy: '「隨身碟模式」。'
  },
  {
    term: 'TeamViewer / AnyDesk',
    category: 'Apps',
    definition: '第三方遠端支援軟體。',
    analogy: '「遠端幫手」。'
  },
  {
    term: 'Terminal',
    category: 'Core',
    definition: '終端機。',
    analogy: '「指令介面」。'
  },
  {
    term: 'Tethering',
    category: 'Network',
    definition: '網路分享 (熱點)。',
    analogy: '「熱點」。'
  },
  {
    term: 'Token',
    category: 'Security',
    definition: '代碼/權杖。',
    analogy: '「通行證」。'
  },
  {
    term: 'TouchID',
    category: 'Hardware',
    definition: '指紋辨識。',
    analogy: '「指紋鎖」。'
  },
  {
    term: 'True Tone',
    category: 'Hardware',
    definition: '原彩顯示。',
    analogy: '「自動變色」。'
  },
  {
    term: 'Trust Profile',
    category: 'Security',
    definition: '信任描述檔。包含根憑證的 Payload，讓裝置信任企業 CA。',
    analogy: '「信任清單」。告訴裝置「這個人（伺服器）是好人，可以相信他」。'
  },
  // --- U ---
  {
    term: 'UEM (Unified Endpoint Management)',
    category: 'Core',
    definition: '統一端點管理。MDM 的進階版，跨平台管理手機與電腦。',
    analogy: '「全能管家」。'
  },
  {
    term: 'Update Inventory',
    category: 'Core',
    definition: '更新資產。強制裝置回報最新狀態。',
    analogy: '「總體檢」。'
  },
  {
    term: 'USB-C',
    category: 'Hardware',
    definition: '通用介面。',
    analogy: '「萬用孔」。'
  },
  {
    term: 'User Enrollment',
    category: 'Enrollment',
    definition: '使用者註冊 (BYOD)。',
    analogy: '「私人公用分開」。'
  },
  {
    term: 'UUID',
    category: 'Core',
    definition: '通用唯一識別碼。軟體層級的唯一 ID。',
    analogy: '「系統編號」。'
  },
  // --- V ---
  {
    term: 'VLAN',
    category: 'Network',
    definition: '虛擬區域網路。將實體網路邏輯切割。',
    analogy: '「虛擬隔間」。'
  },
  {
    term: 'Volume Owner',
    category: 'Security',
    definition: '磁碟擁有者 (Apple Silicon)。擁有授權 Mac 啟動與更新權限的使用者。',
    analogy: '「啟動鑰匙持有人」。'
  },
  {
    term: 'Volume Purchasing (VPP)',
    category: 'Apple',
    definition: '大量採購計畫。批量購買 App 授權。',
    analogy: '「App 團購」。'
  },
  {
    term: 'VPN (Virtual Private Network)',
    category: 'Network',
    definition: '虛擬私人網路。',
    analogy: '「加密隧道」。'
  },
  // --- W ---
  {
    term: 'Wallpaper',
    category: 'Core',
    definition: '桌布。',
    analogy: '「桌布」。'
  },
  {
    term: 'Web Clip',
    category: 'Core',
    definition: '網頁捷徑圖示。',
    analogy: '「網頁書籤」。'
  },
  {
    term: 'Whitelist (Allowlist)',
    category: 'Security',
    definition: '白名單。僅允許清單內的 App 或網站執行。',
    analogy: '「貴賓名單」。'
  },
  {
    term: 'Wi-Fi',
    category: 'Network',
    definition: '無線網路。',
    analogy: '「Wi-Fi」。'
  },
  {
    term: 'Wipe (Erase Device)',
    category: 'Security',
    definition: '清除裝置。',
    analogy: '「格式化」。'
  },
  // --- X ---
  {
    term: 'XProtect',
    category: 'Security',
    definition: 'macOS 內建防毒機制。自動偵測並阻擋已知惡意軟體。',
    analogy: '「內建防毒」。'
  },
  // --- Z ---
  {
    term: 'Zero-Day',
    category: 'Security',
    definition: '零時差攻擊。針對尚未修補漏洞的攻擊。',
    analogy: '「突襲」。'
  },
  {
    term: 'Zero-Touch Deployment',
    category: 'Enrollment',
    definition: '零接觸部署。',
    analogy: '「開箱即用」。'
  }
];

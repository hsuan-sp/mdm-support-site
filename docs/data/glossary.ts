/**
 * 維護指南：
 * 1. 若要新增術語，請直接複製下方的 {...}區塊並貼在對應分類中。
 * 2. 修改存檔後，下次啟動 (npm run docs:dev) 會自動更新搜尋索引。
 */
export interface Term {
  term: string;
  category: 'Core' | 'Enrollment' | 'Apple' | 'Network' | 'Security' | 'Hardware' | 'Apps' | 'Other';
  definition: string;
  analogy: string; // "白話文/比喻"
}

export const glossaryData: Term[] = [
  // --- Core Concepts ---
  {
    term: 'MDM (Mobile Device Management)',
    category: 'Core',
    definition: '行動裝置管理系統。用於遠端管理、監控和維護智慧型手機、平板和電腦的軟體平台。',
    analogy: '學校的「資訊組長」。坐在辦公室透過電腦系統，統一管理全校所有的平板，不用一台一台與老師借來設定。'
  },
  {
    term: 'Profile (設定描述檔)',
    category: 'Core',
    definition: '一個 XML 格式的檔案 (.mobileconfig)，內含具體的設定參數（如 Wi-Fi 密碼、限制原則）。',
    analogy: '給平板的「錦囊妙計」。平板打開錦囊（安裝描述檔），就知道該連哪個 Wi-Fi、不能做什麼事。'
  },
  {
    term: 'Payload (承載資料)',
    category: 'Core',
    definition: '描述檔中的單一設定項目，例如「一個 Wi-Fi 設定」就是一個 Payload。',
    analogy: '資訊組長發的「設定檢核表」。錦囊（描述檔）是整張表，Payload 就是上面勾選的項目：「要連學校Wi-Fi」、「不能自行安裝遊戲」。'
  },
  {
    term: 'Supervision (受監管)',
    category: 'Core',
    definition: '一種高權限的管理狀態，通常透過 ADE 或 Apple Configurator 啟用。允許 MDM 執行更深層的控制（如單一 App 模式、禁止刪除 App）。',
    analogy: '平板的「公務機模式」。一旦受監管，這台機器就是學校的資產，不再是個人的玩具，學校擁有絕對控制權。'
  },
  {
    term: 'OTA (Over-The-Air)',
    category: 'Core',
    definition: '空中傳輸技術。指透過無線網路發送指令或更新，無需實體連接線。',
    analogy: '「隔空喊話」。不用把平板收回來插線，直接用網路發送命令。'
  },
  
  // --- Apple Services ---
  {
    term: 'ASM (Apple School Manager)',
    category: 'Apple',
    definition: 'Apple 校務管理。Apple 提供的網頁入口，用於管理人員、裝置指派與內容購買。',
    analogy: 'Apple 的「戶政事務所」兼「採購中心」。所有學校買的平板和 App 都要先在這裡登記戶口。'
  },
  {
    term: 'ABM (Apple Business Manager)',
    category: 'Apple',
    definition: 'Apple 商務管理。企業用的 ASM 版本，功能大致相同但針對企業場景。',
    analogy: 'ASM 的「企業版雙胞胎」。'
  },
  {
    term: 'Apple ID',
    category: 'Apple',
    definition: 'Apple 的使用者帳戶系統，用於存取 iCloud、App Store 等服務。',
    analogy: 'Apple 世界的「身分證」。'
  },
  {
    term: 'Managed Apple ID (管理式 Apple ID)',
    category: 'Apple',
    definition: '由 ASM 建立與管理的 Apple ID。功能受限（不能買 App），專用於教育與企業協作。',
    analogy: '學校配發的「公務帳號」。專門用來教學和協作，權限由資訊組長控管，不能像私人帳號那樣隨意下載付費軟體。'
  },
  {
    term: 'VPP (Volume Purchase Program)',
    category: 'Apple',
    definition: '大量採購計畫（現已整合至 ASM）。允許組織批量購買 App 和書籍授權並進行分發。',
    analogy: 'App 的「團購批發」。學校一次買 100 個授權，然後分給 100 台平板用。'
  },
  {
    term: 'ADE (Automated Device Enrollment)',
    category: 'Enrollment',
    definition: '自動裝置註冊（舊稱 DEP）。讓裝置在開機設定過程中自動向 MDM 報到並下載設定。',
    analogy: '平板的「出生證明」。一開機連上網，Apple 伺服器就會告訴它：「你是某某學校的財產，請去跟 MDM 報到」，完全不用人手設定。'
  },
  {
    term: 'APNs (Apple Push Notification service)',
    category: 'Apple',
    definition: 'Apple 推播通知服務。MDM 伺服器與 Apple 裝置間通訊的專用通道。',
    analogy: 'MDM 和平板之間的「傳令兵」。MDM 不能直接對平板大吼大叫，一定要透過這個傳令兵（Apple）把指令送達。'
  },
  
  // --- Enrollment & Deployment ---
  {
    term: 'User Enrollment',
    category: 'Enrollment',
    definition: '使用者註冊。專為 BYOD 設計，將個人資料與工作資料隔離，保護使用者隱私。',
    analogy: '在你的私人手機上租一個「獨立辦公室」。學校只能管辦公室裡的東西，管不到你私人的照片和 Line。'
  },
  {
    term: 'Device Enrollment',
    category: 'Enrollment',
    definition: '裝置註冊。傳統的註冊方式，視整台裝置為組織所有，管理權限較大。',
    analogy: '這台車是「公務車」。整台車都是公司的，公司可以隨時查看、管理。'
  },
  {
    term: 'PreStage Enrollment',
    category: 'Enrollment',
    definition: 'Jamf Pro 中的功能，用於設定 ADE 裝置在「哈囉」畫面時的行為（如跳過設定、強制命名）。',
    analogy: '新生入學的「報到關卡」。決定平板第一次開機時要填什麼表格、可以直接跳過哪些廢話。'
  },
  {
    term: 'Blueprint (藍圖 - Apple Configurator)',
    category: 'Enrollment',
    definition: 'Apple Configurator 中的「模板」。錄製好的一連串設定動作（如：命名+連Wi-Fi+監管），可一鍵套用給大量裝置。',
    analogy: '設定平板的「印章」。刻好一個印章（包含所有設定），平板接上來，「啪」蓋下去，設定就全好了。'
  },
  {
    term: 'Zero-Touch Deployment',
    category: 'Enrollment',
    definition: '零接觸部署。IT 人員完全無需拆箱，裝置直接送到使用者手中，開機連網即自動完成設定。',
    analogy: '「開箱即用」。新平板寄到老師手上，撕開膠膜開機，所有學校設定自動跑出來，IT 人員連碰都不用碰。'
  },
  {
    term: 'Return to Service',
    category: 'Enrollment',
    definition: '返回服務。iPadOS 17+ 新功能，清除裝置時可保留 Wi-Fi 設定，重置後自動連網並重新納管。',
    analogy: '「投胎轉世但帶著記憶」。平板喝了孟婆湯（重置）忘記所有資料，但還記得 Wi-Fi 密碼，所以能馬上連線回來找 MDM 報到。'
  },
  
  // --- Security & Network ---
  {
    term: 'Activation Lock (啟用鎖定)',
    category: 'Security',
    definition: '啟用鎖定。防盜機制，重置後需輸入原擁有者的 Apple ID 才能解鎖。MDM 可透過代碼解除。',
    analogy: '防小偷的「護身符」。就算小偷把平板偷走重灌，沒有密碼也打不開，變磚頭一塊。'
  },
  {
    term: 'Lost Mode (遺失模式)',
    category: 'Security',
    definition: '當裝置遺失時，MDM 可遠端鎖定螢幕並顯示訊息，同時強制追蹤位置。',
    analogy: '「緊急封鎖令」。平板不見了，馬上遠端鎖死它，並要在螢幕上顯示「這是我掉的，請打電話給我」，同時瘋狂回報位置。'
  },
  {
    term: 'Remote Wipe (遠端清除)',
    category: 'Security',
    definition: 'MDM 發送指令將裝置恢復原廠設定，清除所有資料。',
    analogy: '手機的「恢復原廠」。像是在拍賣二手機之前，把裡面所有照片、LINE對話全部清空，變回新買來的樣子。'
  },
  {
    term: 'SSID',
    category: 'Network',
    definition: 'Service Set Identifier。即 Wi-Fi 無線網路的名稱。',
    analogy: 'Wi-Fi 的「名字」。你在清單上看到的「TP-Link_5G」或「School-WiFi」就是 SSID。'
  },
  {
    term: 'MAC Address (MAC 位址)',
    category: 'Network',
    definition: '網路卡卡號。每一個網路設備獨一無二的硬體編號。',
    analogy: '網卡的「身分證字號」。全世界唯一，用來辨識這台機器是誰。'
  },
  {
    term: 'Private Wi-Fi Address (私有 Wi-Fi 位址)',
    category: 'Network',
    definition: '為了隱私，iPhone/iPad 連接 Wi-Fi 時會偽造一個隨機的 MAC 位址，避免被追蹤。',
    analogy: '網路上的「假名」。去咖啡廳連 Wi-Fi 時用假名，老闆就不知道你昨天也來過。但在學校這會導致網管不認識你，連不上網。'
  },
  {
    term: 'VPN (Virtual Private Network)',
    category: 'Network',
    definition: '虛擬私人網路。建立加密通道，讓裝置像是在內網一樣存取資源，或進行內容過濾。',
    analogy: '網路上的「專屬隧道」。雖然走在公共道路上，但我們蓋了一條加密隧道，外面的人看不到你在傳送什麼。'
  },
  {
    term: 'Content Filter (內容過濾器)',
    category: 'Network',
    definition: '用於攔截並檢查網路流量的機制，可封鎖不當網站（色情、暴力）。',
    analogy: '學校網路的「守門員」。就像學校禁止以前的學生去網咖一樣，這個機制會擋掉色情、賭博網站，保護學生不要誤入歧途。'
  },
  
  // --- Apps & Features ---
  {
    term: 'Self Service',
    category: 'Apps',
    definition: 'Jamf 提供的自助服務 App。類似企業內部的 App Store，使用者可自行選擇安裝經核准的 App。',
    analogy: '學校專屬的「福利社」。架上都是老師挑選好的 App，學生可以自己進去拿（下載），不用花錢也不需審核。'
  },
  {
    term: 'Single App Mode (單一 App 模式)',
    category: 'Apps',
    definition: '將裝置鎖定在唯一的 App 畫面上，無法跳出、無法按 Home 鍵。常若用於考試或導覽機 (Kiosk)。',
    analogy: '餐廳的「點餐模式」。平板放在那邊只顯示菜單，客人怎麼亂按都跳不出去，不能拿來上網或玩遊戲。'
  },
  {
    term: 'Shared iPad (共享 iPad)',
    category: 'Apps',
    definition: '讓多位使用者使用各自的管理式 Apple ID 登入同一台 iPad，資料互相隔離。',
    analogy: '「共用電腦」的概念。雖然大家共用一台平板，但每個人登入後看到都是自己的桌面和檔案。'
  },
  {
    term: 'Classroom App (Apple 課堂)',
    category: 'Apps',
    definition: 'Apple 推出的教學輔助 App，讓老師能即時監看學生畫面、鎖定螢幕或導引開啟 App。',
    analogy: '各科老師的「隨堂監控」。老師在講台上，可以直接看到台下每一位同學的平板畫面，確認大家有沒有專心上課。'
  },
  {
    term: 'Global Proxy (全域代理)',
    category: 'Network',
    definition: '強制裝置所有流量都必須經過指定的代理伺服器。',
    analogy: '高速公路的「收費站」。不管你的車（流量）要去哪裡，一定要經過這個收費站檢查一下，不能走田間小路偷溜。'
  },
  {
    term: 'Certificate (憑證)',
    category: 'Security',
    definition: '數位身分證明文件。用於驗證網站、伺服器或裝置的真實性。',
    analogy: '數位世界的「印鑑證明」。證明「我是我」，確保沒人冒充 Jamf 伺服器來騙你的平板。'
  },
  {
    term: 'CSR (Certificate Signing Request)',
    category: 'Security',
    definition: '憑證簽署請求。在申請正式憑證前，需先產生一份請求檔交給發證單位 (如 Apple)。',
    analogy: '「申請書」。你要申請印鑑證明，要先填好這張申請書，蓋上你的私章，再拿去給戶政事務所（Apple）核發。'
  },
  
  // --- Hardware & System ---
  {
    term: 'DFU Mode',
    category: 'Hardware',
    definition: 'Device Firmware Update 模式。比復原模式更底層的救援模式，螢幕強制全黑，用於重灌韌體。',
    analogy: '平板的「加護病房」。當平板病入膏肓（系統掛點），連普通急診（復原模式）都救不了時，就要送進這裡強制電擊（重灌）。'
  },
  {
    term: 'Recovery Mode (復原模式)',
    category: 'Hardware',
    definition: '用於回復 iPhone/iPad 作業系統的模式，螢幕會顯示連接電腦的圖示。',
    analogy: '平板的「急診室」。系統怪怪的或密碼忘記時，進來這裡掛號，醫生（電腦）幫你重裝系統。'
  },
  {
    term: 'True Tone (原彩顯示)',
    category: 'Hardware',
    definition: '根據環境光線自動調整螢幕色溫的技術。',
    analogy: '螢幕的「變色龍」功能。在黃光下螢幕變黃一點，白光下變白一點，讓你看起來像在看紙張一樣舒服。'
  },
  {
    term: 'Night Shift',
    category: 'Hardware',
    definition: '夜覽模式。夜間自動過濾藍光，將螢幕轉為暖色調。',
    analogy: '螢幕的「護眼模式」。晚上把刺眼的藍光濾掉，讓你好睡一點。'
  },
  {
    term: 'AirDrop',
    category: 'Core',
    definition: 'Apple裝置間的快速檔案傳輸功能，使用藍牙與 Wi-Fi。',
    analogy: '數位「遞紙條」。不用連上網，手機對手機直接把照片或檔案丟過去。'
  },
  {
    term: 'AirPlay',
    category: 'Core',
    definition: '無線投影技術。將畫面投射到 Apple TV 或支援的螢幕上。',
    analogy: '無線「投影機」。把小螢幕的畫面直接變魔術投到大電視上。'
  },
  {
    term: 'Tethering (個人熱點)',
    category: 'Network',
    definition: '分享行動網路連線給其他裝置使用。',
    analogy: '手機開「熱點」。把你的手機變成一台 Wi-Fi 機，分網路給平板或筆電用，這在沒有 Wi-Fi 的地方很好用。'
  },
  {
    term: 'Asset Tag (資產標籤)',
    category: 'Core',
    definition: '學校自行編列的設備編號，通常貼在機身背面。MDM 可欄位紀錄此編號。',
    analogy: '財產上的「財產標籤」。像是學校桌椅後面貼的那個銀色貼紙「110-學-001」，用來盤點這台平板是誰的。'
  },
  {
    term: 'Wallpaper (桌布)',
    category: 'Core',
    definition: '主畫面或鎖定畫面的背景圖片。MDM 可強制派送統一桌布。',
    analogy: '平板的「制服」。學校規定大家的桌面都要長一樣，看起來比較整齊。'
  },
  {
    term: 'Web Clip',
    category: 'Core',
    definition: '網頁捷徑。放在主畫面上的一個圖示，點選後會開啟特定網頁。',
    analogy: '放在桌面的「書籤」。長得像 App，但點開來其實是瀏覽器連到學校官網。'
  },
  {
    term: 'Bundle ID',
    category: 'Apps',
    definition: 'App 的唯一識別碼 (如 com.apple.safari)。MDM 用它來精確指定要管理的 App。',
    analogy: 'App 的「身分證字號」。世界上可能有很多 App 叫 "Calculator"，但 Bundle ID 絕對不會重複。'
  },
  {
    term: 'VPP Token (伺服器權杖)',
    category: 'Security',
    definition: 'ASM 與 MDM 之間溝通 VPP 授權的加密金鑰。需每年更新。',
    analogy: '去好事多 (Costco) 的「會員卡」。MDM 要去 Apple「批貨」下載 App，一定要出示這張會員卡，Apple 才會讓你搬貨。'
  },
  {
    term: 'DEP Token (伺服器權杖)',
    category: 'Security',
    definition: 'ASM 與 MDM 之間溝通 ADE 裝置資料的加密金鑰。需每年更新。',
    analogy: '給戶政事務所的「授權書」。你要委託 MDM 幫你去 Apple 那邊把新買的平板領回來納管，就要這張授權書，不然 Apple 覺得你是詐騙集團。'
  },
  {
    term: 'Smart Group (智慧型群組)',
    category: 'Core',
    definition: 'Jamf 中的動態群組。根據設定的條件（如：電量低於 20%）自動將裝置加入群組。',
    analogy: '「自動分類帽」。不用人工分班，只要設定條件（例如：男生），新同學一進來是男生就會自動被分進男生班。'
  },
  {
    term: 'Static Group (靜態群組)',
    category: 'Core',
    definition: 'Jamf 中的固定群組。需管理員手動將裝置加入。',
    analogy: '「固定名冊」。資訊組長手動建立的名單，例如「五年級自然科用機」。'
  },
  {
    term: 'Sideloading (側載)',
    category: 'Apps',
    definition: '不透過 App Store，直接安裝 .ipa 檔案到 iOS 裝置。通常需透過 Configurator 或企業憑證。',
    analogy: '「走後門」安裝。不走正門（App Store）審核，直接把 App 檔案塞進去。'
  },
  {
    term: 'Passcode Policy (密碼原則)',
    category: 'Security',
    definition: '強制要求使用者設定的螢幕解鎖密碼複雜度（如：至少 6 碼）。',
    analogy: '「門禁規定」。規定你的鑰匙一定要打幾齒以上，太簡單的鑰匙（密碼）不能用。'
  },
  {
    term: 'Roaming (漫遊)',
    category: 'Network',
    definition: '裝置在多個 Wi-Fi 基地台之間移動時，自動切換連線的行為。',
    analogy: '「接力跑」。你走到哪，哪邊的基地台就接手服務你，網路不會斷掉。'
  },
  {
    term: 'Cache (快取)',
    category: 'Core',
    definition: '暫存資料。Apple 設有 Caching Server 可暫存 App 下載檔，加速內網更新。',
    analogy: '學校的「糧倉」。常用的課本（App）先搬一堆放在學校糧倉，學生要領書直接去糧倉拿，不用每個人都跑去出版社（Apple）搬。'
  },
  {
    term: 'JSS (Jamf Software Server)',
    category: 'Core',
    definition: 'Jamf Pro 的核心伺服器，負責發送指令與儲存所有裝置資料。',
    analogy: 'MDM 的「大腦」。所有指令都是從這裡發出去的，它也記得每一台平板叫什麼名字、剩多少電。'
  },
  {
    term: 'Push Notification (推播通知)',
    category: 'Core',
    definition: 'MDM 用來叫醒裝置的訊號。透過 Apple 伺服器傳送。',
    analogy: '資訊組長廣播「請注意」。MDM 發出訊號，平板收到後就會醒來接收新的指令。'
  },
  {
    term: 'Pending Command (擱置的指令)',
    category: 'Core',
    definition: '已經發出但裝置尚未執行的指令。通常是因為裝置離線或關機。',
    analogy: '「未讀訊息」。老闆Line你了，但你手機沒開，訊息就掛在那邊等你開機才看得到。'
  },
  {
    term: 'Renew Certificate (更新憑證)',
    category: 'Security',
    definition: '每年必須執行的維護工作，確保 MDM 與 Apple 之間的通訊授權有效。',
    analogy: '像是「更換行照」。行照過期就不能上路了，所以每年時間到之前，都要去監理站（Apple）換一張新的證書回來，MDM 才能繼續指揮交通。'
  },
  {
    term: 'Kiosk Mode (導覽機模式)',
    category: 'Apps',
    definition: '即單一 App 模式。限制使用者只能操作某一個特定的 App。',
    analogy: '「展場模式」。像你去博物館看到的平板，只能按導覽，不能跳出來玩遊戲。'
  },
  
  // --- Expanded Hardware & Others ---
  {
    term: 'BYOD (Bring Your Own Device)',
    category: 'Other',
    definition: '員工或學生攜帶自己的私人裝置來工作或學習，並接受有限度的管理。',
    analogy: '「自備工具」。木工師傅帶自己的電鋸去工地，雖然是私人的，但在工地還是要聽工頭的指揮。'
  },
  {
    term: 'COPE (Corporate-Owned, Personally Enabled)',
    category: 'Other',
    definition: '公司配發的裝置，但允許員工用於私人用途（如裝私人 App）。',
    analogy: '「配車」。公司給你一台車，上班要開去送貨，但下班允許你開去除玩，只要不違法就好。'
  },
  {
    term: 'Lightning Connector',
    category: 'Hardware',
    definition: 'Apple 專有的傳輸充電介面（舊款 iPad/iPhone 使用）。',
    analogy: '「蘋果舊插頭」。只能插蘋果裝置，跟外面的安卓線都不通。'
  },
  {
    term: 'USB-C',
    category: 'Hardware',
    definition: '通用序列匯流排 Type-C。新款 iPad/Mac 的標準介面，傳輸速度快且通用性高。',
    analogy: '「萬用插頭」。跟筆電、安卓手機通用的插孔，插隨身碟、螢幕都很方便。'
  },
  {
    term: 'Dongle (轉接器)',
    category: 'Hardware',
    definition: '用來轉接不同介面的短線（如 USB-C 轉 HDMI）。',
    analogy: '「翻譯蒟蒻」。平板講中文（USB-C），投影機講英文（HDMI），中間插這根才能溝通。'
  },
  {
    term: 'eSIM',
    category: 'Hardware',
    definition: '嵌入式 SIM 卡。直接內建在電路板上的虛擬 SIM 卡，無需插拔實體卡片。',
    analogy: '「數位門號」。不用去電信行拿小卡片插進去，掃個 QR Code 手機就有訊號了。'
  },
  {
    term: 'Cellular (行動網路版)',
    category: 'Hardware',
    definition: '支援 SIM 卡或 eSIM 的 iPad 機型，可獨立上網。',
    analogy: '「插卡版」。像手機一樣，走到哪都有網路，不用到處找 Wi-Fi。'
  },
  {
    term: 'Brick (變磚)',
    category: 'Other',
    definition: '裝置因軟體錯誤或硬體損壞，完全無法開機或運作。',
    analogy: '「植物人狀態」。平板完全沒反應，跟一塊磚頭一樣只能拿來墊桌腳。'
  },
  {
    term: 'Provisioning (佈建)',
    category: 'Other',
    definition: '將新裝置準備好並交付給使用者的整個設定過程。',
    analogy: '「入職手續」。從新員工（平板）報到、領識別證、開帳號到分配座位的整個流程。'
  }
];

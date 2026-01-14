---
id: mac-2
title: "如何管理 Mac 的本機管理者權限 (Local Admin)？"
category: "第七部分：Mac 電腦進階管理 (Mac Management)"
important: false
tags: ["帳號權限","LAPS","資安","Privileges","最小權限原則"]
---

# Q: 如何管理 Mac 的本機管理者權限 (Local Admin)？

# Answer

**最佳實踐是「日常使用標準帳戶」搭配「LAPS (本機管理員密碼解決方案)」。**
**嚴禁讓使用者長期持有 Admin 權限。**

給予教師或學生 Admin 權限是校園資安的最大破口，這會導致防毒軟體被關閉、
惡意軟體被安裝，甚至整個內網被勒索病毒加密。

**管理策略三部曲：**

**1. 剝奪常駐權限 (Standard User)**
*   所有教職員配發的 Mac，預設登入帳號應為 **「標準使用者 (Standard User)」**。
*   在此權限下，使用者無法修改系統核心設定或安裝系統級軟體。

**2. 導入 LAPS (Local Administrator Password Solution)**
*   **痛點**：以往 IT 會在所有電腦設定一個通用的 admin 密碼（如 `School2025!`），
    一旦洩漏全校淪陷。
*   **解法**：Jamf Pro 內建 LAPS 功能，能確保每台 Mac 的隱藏管理員密碼
    **「皆不相同」** 且 **「定期自動輪換」**。
*   **操作**：當 IT 需要維修某台電腦時，至 Jamf Pro 後台查詢該機當下的隨機密碼，
    使用後系統會自動在下次連網時更換新密碼。

**3. 自助權限提升 (Privileges App)**
*   若老師偶爾需要安裝驅動程式怎麼辦？
*   **工具**：部署 **Privileges** (免費開源工具) 或 Jamf 內建的類似功能。
*   **流程**：老師點選 Dock 上的鎖頭圖示 > 說明理由 > 獲得 **「20 分鐘的管理員權限」**。
    時間一到，系統自動將其降回標準使用者。
*   這既給予了方便，又維持了「最小權限原則 (Principle of Least Privilege)」。
    
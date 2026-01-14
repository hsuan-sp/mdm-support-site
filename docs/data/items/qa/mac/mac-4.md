---
id: mac-4
title: "Mac 下載軟體時出現「無法打開，因為它來自未識別的開發者」，如何解決？"
category: "第七部分：Mac 電腦進階管理 (Mac Management)"
important: false
tags: ["Gatekeeper","安全性","Notarization","軟體簽署"]
---

# Q: Mac 下載軟體時出現「無法打開，因為它來自未識別的開發者」，如何解決？

# Answer

**這是 macOS 的「Gatekeeper (守門員)」安全機制。**
**管理員可透過 MDM 允許特定開發者，或教導使用者正確的開啟方式。**

Apple 強制要求軟體需經過 **公證 (Notarization)**。若軟體太舊或未簽署，就會被阻擋。

**解決方案：**

**方法 A：使用者端操作 (右鍵開啟)**
這是最簡單的臨時解法，不需降低安全性設定。
1.  在 Finder 中找到該 App。
2.  按住鍵盤 `Control` 鍵並點擊 App (或是滑鼠右鍵)。
3.  在選單中選擇 **「打開 (Open)」**。
4.  此時跳出的視窗會多出一個「打開」按鈕，點選後系統會將其加入信任白名單，
    下次即可直接雙擊開啟。

**方法 B：MDM 統一設定 (System Policy Control)**
若某個教學軟體全校都要用，且都會被擋：
1.  在 Jamf Pro 建立「組態設定檔」。
2.  選擇 **「系統原則控制 (System Policy Control)」** Payload。
3.  雖然可以選擇「允許從任何來源下載 (Disable Gatekeeper)」，但**極度不推薦**，
    因為這會讓 Mac 對惡意軟體門戶大開。
4.  **正確做法**：提取該軟體的 **Team ID** 或簽署憑證，
    將其加入 **「核心延伸功能 (Kernel Extensions)」** 或 **「系統延伸功能」** 的白名單中。

**實務建議**：
若遇到連右鍵都打不開的軟體（顯示「已損毀」），通常是因為該軟體未經公證且被隔離 (Quarantine)。
需透過終端機指令 `xattr -r -d com.apple.quarantine /path/to/app` 解除隔離，
這可透過 Jamf Policy 的 Script 功能統一執行。
    
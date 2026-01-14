---
id: cls-12
title: "【考試防弊】如何避免學生用 Apple Intelligence (寫作工具) 或數學備忘錄作弊？"
category: "第四部分：課堂管理與教學應用 (Classroom Management)"
important: false
tags: ["Apple Intelligence","寫作工具","數學備忘錄","防弊","iOS 18"]
---

# Q: 【考試防弊】如何避免學生用 Apple Intelligence (寫作工具) 或數學備忘錄作弊？

# Answer

**針對 iOS 18.1+ 裝置，管理員可透過「限制描述檔」精確關閉 AI 輔助功能。**

**風險功能**：
*   **寫作工具 (Writing Tools)**：可幫學生重寫文章、摘要重點。
*   **數學備忘錄 (Math Notes)**：在計算機或備忘錄手寫算式，系統自動算出答案。

**設定路徑 (Jamf Pro)**：
1.  建立或編輯 **「限制 (Restrictions)」** 描述檔。
2.  在 iOS 18 相關設定中，取消勾選（即禁用的意思）：
    *   **「允許寫作工具 (Allow Writing Tools)」**
    *   **「允許數學備忘錄 (Allow Math Notes)」**
    *   **「允許 Genmoji」**
3.  **考試模式**：若只需暫時關閉，老師可透過 **Jamf Teacher** 的「App 限制」功能，
    在上課期間鎖定這些功能（需 Jamf Teacher 版本支援），或直接使用「單一 App 模式」鎖定考試軟體。

*   *硬體提醒：Apple Intelligence 僅支援配備 M 系列晶片或 A17 Pro 以上的 iPad/iPhone。*
    *一般入門款 iPad (如第 9/10 代) 硬體本身即不支援寫作工具，無需擔心。*
    
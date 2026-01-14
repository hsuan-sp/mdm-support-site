---
id: edu-19
title: "新要求：教育部資安稽核要求符合 NIST 標準，MDM 該如何配合？"
category: "第八部分：教育場域常見情境 (Education Scenarios)"
important: false
tags: ["資安稽核","NIST","規範"]
---

# Q: 新要求：教育部資安稽核要求符合 NIST 標準，MDM 該如何配合？

# Answer

**校園載具需落實 NIST（美國國家標準暨技術研究院）的網路安全基準，**
**包含密碼複雜度、裝置完整性偵測與即時 Patch 更新。**

**實務建議：管理員實施**
1.  **密碼策略**：強制 6 位數以上，且 90 天強制更換。
2.  **OS 版本偵測**：利用 Smart Group 自動篩選 N-1 版本以前的裝置，限制其訪問內部網路。
3.  **Managed App Attestation**：開啟受管理裝置認證，確保連線的裝置未經越獄或竄改。
    
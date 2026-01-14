---
id: dl-8
title: "學校 Wi-Fi 訊號很差，精進方案的 iPad 可以接有線網路 (Ethernet) 嗎？"
category: "第五部分：數位學習精進方案專區 (MOE Digital Learning Project)"
important: false
tags: ["網路","有線連接","Ethernet","Lightning","iPad 9"]
---

# Q: 學校 Wi-Fi 訊號很差，精進方案的 iPad 可以接有線網路 (Ethernet) 嗎？

# Answer

**可以。雖然精進方案採購的 iPad 是 Lightning 介面，**
**但仍可透過專用轉接器連接有線網路。**

由於 Lightning 接口的供電能力有限，連接有線網路時通常需要額外供電。

**硬體需求 (針對 Lightning 機型)**：

1.  **專用轉接器 (推薦)**：
    *   **Belkin Ethernet + Power Adapter with Lightning Connector或其他官方轉接頭**：
        Apple 官方認證且最穩定的方案，支援同時上網與充電 (PoE 支援型號甚至可直接供電)。
    *   **一般 Lightning 轉 RJ45**：市面上有副廠轉接頭，但穩定性參差不齊，
        且必須選擇 **「帶有充電孔」** 的版本，否則 iPad 會顯示「配件耗電量過高」而無法使用。

2.  **RJ-45 網路線**：連接至教室牆上的資訊插座。

**操作與設定**：
1.  將轉接器插入 iPad 的 Lightning 孔。
2.  **重要步驟：接上電源**。請務必將充電線插上轉接器的供電孔
    （Lightning 介面推動網卡通常需要外部電力）。
3.  接上網路線。
4.  iPad 的「設定」中會多出一個 **「乙太網路 (Ethernet)」** 選項。
5.  點入後確認 IP 是否抓取正常（通常為 DHCP）。

**實務建議**：
*   **Jamf Trust 支援**：無論是 Wi-Fi 或有線網路，Jamf Trust 的防護功能與流量計算皆能正常運作。
*   **優先權**：當有線網路連通時，iPad 會自動優先使用有線網路，減少 Wi-Fi 負載。
*   **防火牆規則**：請確認有線網路環境（VLAN）同樣放行了 Apple 與 Jamf 的相關服務通訊埠。
    
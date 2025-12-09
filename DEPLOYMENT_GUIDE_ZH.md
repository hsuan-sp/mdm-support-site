# 部署您的 MDM 技術支援網站 (從零開始指南)

這份指南假設您目前 **只有一個 GitHub 帳號**，電腦上尚未安裝任何開發工具。我們將使用最簡單的圖形化介面工具 **GitHub Desktop** 來完成部署。

---

## 第一步：準備工作

1.  **註冊/登入 GitHub**：前往 [github.com](https://github.com) 登入您的帳號。
2.  **下載 GitHub Desktop**：
    *   前往 [desktop.github.com](https://desktop.github.com) 下載。
    *   **macOS 使用者請注意**：網站通常會自動偵測您的電腦是 **Intel** 還是 **Apple Silicon (M1/M2/M3)** 版本，請下載對應版本。
    *   安裝後打開，登入您的 GitHub 帳號。
    *   *若第一次開啟時出現「安全性提示」，請前往「系統設定」>「隱私權與安全性」中點選「仍要打開」。*

---

## 第二步：建立雲端儲存庫 (Repository)

1.  回到 **GitHub 網站**。
2.  點擊右上角的 **「+」** 號，選擇 **「New repository」**。
3.  **Repository name**：輸入您想要的專案名稱，例如 `mdm-support-site`。
4.  **Public/Private**：選擇 **Public (公開)**（GitHub Pages 免費版通常需公開）。
5.  其他選項保持預設，直接點擊頁面最下方的 **「Create repository」**。

---

## 第三步：將程式碼上傳到 GitHub

1.  **在 GitHub Desktop 中複製專案**：
    *   打開 GitHub Desktop 軟體。
    *   點選 **「Add」** > **「Clone Repository...」**。
    *   找到您剛才建立的 `mdm-support-site`，選取它。
    *   **Local Path**：選擇您電腦上的一個資料夾位置（請記住這個位置，例如 `Documents/GitHub/mdm-support-site`）。
    *   點擊 **「Clone」**。

2.  **放入檔案**：
    *   打開 **Finder** (訪達)，進入剛剛下載的 `mdm-support-site` 資料夾。
    *   **將我為您生成的「technical-support-site」資料夾內的所有內容**（包含 `docs`, `package.json`, `.github`, `.gitignore` 等），全部**複製 (Cmd+C) 貼上 (Cmd+V)** 到這個資料夾中。

3.  **送出變更**：
    *   回到 GitHub Desktop 軟體，您會看到左側出現了一大堆綠色的新增檔案。
    *   *提示：因為我們加入了 `.gitignore`，所以不會看到討厭的 `.DS_Store` 系統垃圾檔。*
    *   在左下角的 **Summary** 欄位輸入：`Initial commit`。
    *   點擊 **「Commit to main」** 按鈕。
    *   點擊右上方或中間的 **「Push origin」** 按鈕。

---

## 第四步：設定自動部署 (GitHub Pages)

因為我們已經設定好了自動化腳本 (`.github/workflows/deploy.yml`)，所以只要您推送程式碼，GitHub 就會自動開始建置網站。您只需要開啟權限即可。

1.  回到 **GitHub 網站** (您的專案頁面)。
2.  點選上方的 **「Settings (設定)」** 標籤頁。
3.  在左側選單找到 **「Pages」**。
4.  **Build and deployment**：
    *   **Source**：請確認選擇 **「GitHub Actions」** (如果選單裡有這個選項)。
    *   *注意：如果沒看到 GitHub Actions 選項，請略過此步驟，系統偵測到我們的腳本後通常會自動切換。*
5.  **查看進度**：
    *   點選上方的 **「Actions」** 標籤頁。
    *   您應該會看到一個正在跑的流程 (黃色或綠色)，名稱可能是 `Deploy VitePress site to Pages`。
    *   等待它變成 **綠色勾勾 (Success)**。

---

## 第五步：大功告成！

當 Actions 顯示綠色勾勾後：

1.  回到 **Settings > Pages**。
2.  頁面最上方會顯示：**"Your site is live at..."**
3.  點擊該連結，這就是您的 MDM 支援網站了！🎉

---

## (進階) 未來如何管理內容？

雖然這個網站看起來像一個 App，但它本質上是由文字檔組成的。未來若要修改內容，推薦使用 **Pages CMS**：

1.  前往 [app.pagescms.org](https://app.pagescms.org)。
2.  用 GitHub 帳號登入。
3.  選擇您的 `mdm-support-site` 專案。
4.  您就可以像在用 Word 或部落格一樣，直接編輯內容並發布，完全不需要寫程式！

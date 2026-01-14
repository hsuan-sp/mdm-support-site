#!/bin/bash

# ---------------------------------------------------------
# MDM Support Site - 內容管理器啟動器 (macOS 專用)
# ---------------------------------------------------------

# 1. 自動定位到專案根目錄
cd "$(dirname "$0")"

# 2. 終端機視窗美化
clear
echo "================================================"
echo "   MDM Support Site 內容管理工具 (v2.0)"
echo "================================================"
echo "🚀 正在檢查環境並啟動..."

# 3. 確保 Node.js 路徑在環境變數中 (針對 Homebrew 路徑)
export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH"

# 4. 檢查 Python3
if ! command -v python3 &> /dev/null; then
    echo "❌ 錯誤: 找不到 Python3。請前往 https://www.python.org/ 安裝。"
    read -p "按任意鍵結束..."
    exit 1
fi

# 5. 檢查 Tkinter (macOS GUI 核心)
if ! python3 -c "import tkinter" &> /dev/null; then
    echo "❌ 錯誤: 找不到 tkinter 模組。"
    echo "如果您是用 Homebrew 安裝的 Python，請執行:"
    echo "  brew install python-tk"
    echo ""
    read -p "按任意鍵結束..."
    exit 1
fi

# 6. 啟動管理員並隱藏多餘日誌
python3 scripts/content_manager.py &> /dev/null &

# 7. 稍等一秒後自動結束終端機視窗，讓介面保持乾淨
sleep 1
osascript -e 'tell application "Terminal" to quit' &
exit

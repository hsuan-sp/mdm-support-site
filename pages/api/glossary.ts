import { logtoClient } from "@/lib/logto";
import { getGlossaryData } from "@/lib/data";
import type { NextApiRequest, NextApiResponse } from "next";

// 強制使用 Node.js，這在 Vercel 上才能正確跑 fs 動態匯入
export const runtime = "nodejs";

export default logtoClient.withLogtoApiRoute(async (req: NextApiRequest, res: NextApiResponse) => {
  // --- 診斷邏輯 ---
  // 如果你在瀏覽器網址列直接打開這個 API 卻看到 Unauthorized，
  // 請取消下面這行註解，看看終端機有沒有印出 Cookie
  // console.log("Glossary Request Cookies:", req.headers.cookie);

  // 1. 檢查身分
  // req.user 是由 withLogtoApiRoute 根據 Cookie 自動注入的
  if (!req.user || !req.user.isAuthenticated) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Sign-in session not found or expired"
    });
  }

  // 2. 獲取數據
  try {
    const { lang } = req.query;

    // 呼叫你在 lib/data.ts 寫的動態引入版本
    const data = await getGlossaryData(lang === "en" ? "en" : "zh");

    // 設定不快取，確保權限變動時能即時反應
    res.setHeader("Cache-Control", "no-store, max-age=0");
    return res.status(200).json(data);

  } catch (error: any) {
    console.error("[Glossary API Error]:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: error.message
    });
  }
});
import { logtoClient } from "@/lib/logto";
import { getQAData } from "@/lib/data";
import type { NextApiRequest, NextApiResponse } from "next";

export const runtime = "nodejs";

export default logtoClient.withLogtoApiRoute(async (req: NextApiRequest, res: NextApiResponse) => {
  // --- Debug Start ---
  // 如果你在這裡看到空物件，代表 Cookie 根本沒進來 API
  // console.log("Request Cookies:", req.cookies); 
  // --- Debug End ---

  // 1. 檢查身分
  // 注意：某些版本中 isAuthenticated 是在 req.user 裡面
  if (!req.user || !req.user.isAuthenticated) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Logto session valid but req.user missing"
    });
  }

  try {
    const { lang } = req.query;

    // 這裡確保調用的是你那套透過動態 import 讀取 fs 的 getQAData
    const data = await getQAData(lang === "en" ? "en" : "zh");

    res.setHeader("Cache-Control", "no-store, max-age=0");
    return res.status(200).json(data);

  } catch (error: any) {
    console.error("[Guide API Error]:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: error.message
    });
  }
});
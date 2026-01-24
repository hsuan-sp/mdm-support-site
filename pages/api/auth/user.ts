import type { NextApiRequest, NextApiResponse } from "next";

// 簡化版本：使用 Logto SDK 的 server-side helper
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // TODO: 從 session/cookie 取得使用者資訊
    // 這需要完整的 Logto Pages Router 整合

    // 暫時返回未登入狀態
    res.status(401).json({ error: "Not authenticated" });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

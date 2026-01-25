import type { NextApiRequest, NextApiResponse } from "next";
import { logtoClient } from "@/lib/logto";
import { getGlossaryData } from "@/lib/data";
import { isAuthorizedEmail } from "@/lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 1. 伺服器端安全檢查 (Server-side Security Check)
  // 使用 getContext 獲取 Pages Router 環境下的身分上下文
  const context = await logtoClient.getContext(req, res);
  const { isAuthenticated, claims } = context;

  if (!isAuthenticated || !claims) {
    return res.status(401).json({ error: "Unauthorized: Please sign in" });
  }

  // 從 claims 中優先提取 email
  const email = claims.email || (claims as any).primary_email;

  if (!isAuthorizedEmail(email)) {
    console.warn("API direct access blocked for unauthorized domain:", email);
    return res
      .status(403)
      .json({ error: "Forbidden: Authorized email required" });
  }

  // 2. 安全性標頭：防止敏感數據在本地緩存
  res.setHeader("Cache-Control", "no-store, max-age=0");
  try {
    const { lang } = req.query;
    const data = await getGlossaryData(lang === "en" ? "en" : "zh");

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Data not found" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("API Glossary Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

import type { NextApiRequest, NextApiResponse } from "next";
import { logtoClient } from "@/lib/logto";
import { getQAData } from "@/lib/data";
import { isAuthorizedEmail } from "@/lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 1. 伺服器端安全檢查 (Server-side Security Check)
  // 使用 getLogtoContext (使用 any 解決型別不匹配)
  const context = await (logtoClient as any).getLogtoContext(req, res);
  const { isAuthenticated, claims } = context;

  // 加入偵錯日誌
  console.log(
    "[API Debug - Guide] Claims:",
    claims ? JSON.stringify(claims) : "None"
  );

  if (!isAuthenticated || !claims) {
    return res.status(401).json({ error: "Unauthorized: Please sign in" });
  }

  const rawEmail =
    claims.email ||
    (claims as any).primary_email ||
    (claims as any).email_address;

  if (!isAuthorizedEmail(rawEmail)) {
    console.warn(
      "API direct access blocked for unauthorized domain:",
      rawEmail
    );
    return res
      .status(403)
      .json({ error: "Forbidden: Authorized email required" });
  }

  // 2. 安全性標頭：防止敏感數據在本地緩存
  res.setHeader("Cache-Control", "no-store, max-age=0");

  try {
    const { lang } = req.query;
    const data = await getQAData(lang === "en" ? "en" : "zh");

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Data not found" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("API Guide Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

import type { NextApiRequest, NextApiResponse } from "next";
import { withLogtoApiRoute } from "@logto/next";
import { logtoConfig } from "@/lib/logto";
import { getGlossaryData } from "@/lib/data";

/**
 * Glossary API - v4 Protected Route
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  // withLogtoApiRoute 會自動將使用者身分注入 req.user
  if (!req.user.isAuthenticated) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { lang } = req.query;
    const data = await getGlossaryData(lang === "en" ? "en" : "zh");
    res.setHeader("Cache-Control", "no-store, max-age=0");
    res.status(200).json(data);
  } catch (error) {
    console.error("[Glossary API Error]", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export default withLogtoApiRoute(handler, logtoConfig);

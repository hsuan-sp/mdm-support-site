import type { NextApiRequest, NextApiResponse } from "next";
// Logto 認證將透過 middleware 和 session 處理
import { getQAData } from "@/lib/data";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 認證檢查已由 middleware 處理
  // 如果能到達這裡，表示使用者已通過認證

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

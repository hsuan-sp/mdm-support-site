import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Logto callback 會在客戶端處理
  // 這個 API route 只用於 fallback
  res.redirect("/");
}

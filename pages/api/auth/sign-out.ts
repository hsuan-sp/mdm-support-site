import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // 清除 session/cookie
  // TODO: 實作完整的 Logto sign-out

  res.status(200).json({ success: true });
}

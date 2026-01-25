import { logtoClient } from "@/lib/logto";
import { NextApiRequest, NextApiResponse } from "next";

// 1. 確保這是 nodejs，以便讀取檔案系統
export const runtime = "nodejs";

/**
 * Logto Auth API Handler - Pages Router Node.js 版
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 2. 在 Pages Router 中，action 是從 query 取得，而非 URL 物件
  const { action } = req.query;

  try {
    switch (action) {
      case "sign-in":
        return await logtoClient.handleSignIn()(req, res);
      case "sign-in-callback":
        return await logtoClient.handleSignInCallback()(req, res);
      case "sign-out":
        return await logtoClient.handleSignOut()(req, res);
      case "user":
        // 這裡會回傳當前使用者資訊
        return await logtoClient.handleUser()(req, res);
      default:
        res.status(404).end();
    }
  } catch (error: any) {
    console.error("[Logto API Error]", error);
    res.status(500).json({
      error: "Authentication Error",
      message: error.message,
    });
  }
}
import type { NextApiRequest, NextApiResponse } from "next";
import { logtoClient } from "../../../lib/logto";

// ⚠️ 絕對不要寫 export const runtime = "edge"，這會毀了 Cloudflare 的編譯
// 在 Pages Router 中，不寫就是預設 Node.js 模式

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // 1. 取得完整 URL
        // 在 Node.js 環境下，我們從 headers 組合出完整的 URL
        const protocol = req.headers['x-forwarded-proto'] || 'http';
        const host = req.headers.host;
        const fullUrl = `${protocol}://${host}${req.url}`;

        // 2. 呼叫 Logto Callback Handler
        // Logto 的 handleSignInCallback 會傳回一個適配器函數
        // 傳入 fullUrl 讓它知道要處理哪個回傳地址
        const logtoHandler = await logtoClient.handleSignInCallback(fullUrl);

        // 💡 關鍵：Logto SDK 在 Pages Router 下需要 Web 標準的 Request/Response 交互
        // 但在 OpenNext 環境，我們直接呼叫它並傳入轉換後的請求即可
        // 這裡我們直接利用 Logto 內建的處理邏輯
        await logtoHandler(req as any);

        // 成功後，Logto 通常會自動處理 redirect
        // 如果它沒處理，我們可以在這裡手動導向
        if (!res.writableEnded) {
            res.redirect("/");
        }

    } catch (error: any) {
        console.error("❌ Callback 失敗:", error.message);
        // 失敗時強制導回首頁
        if (!res.writableEnded) {
            res.redirect("/");
        }
    }
}